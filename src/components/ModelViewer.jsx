/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/no-unknown-property */
import { Suspense, useRef, useLayoutEffect, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useLoader, useThree, invalidate } from '@react-three/fiber';
import { useGLTF, useFBX, useProgress, Html, Environment, ScrollControls, Scroll, useScroll } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as THREE from 'three';

const deg2rad = d => (d * Math.PI) / 180;

const Loader = ({ placeholderSrc }) => {
  const { progress, active } = useProgress();
  if (!active && placeholderSrc) return null;
  return (
    <Html center>
      {placeholderSrc ? (
        <img src={placeholderSrc} width={128} height={128} style={{ filter: 'blur(8px)', borderRadius: 8 }} />
      ) : (
        <div style={{ 
          color: 'white', 
          background: 'rgba(0,0,0,0.9)', 
          padding: '16px 32px', 
          fontFamily: 'Saira Condensed', 
          letterSpacing: '4px', 
          textTransform: 'uppercase', 
          border: '1px solid rgba(255,255,255,0.1)',
          whiteSpace: 'nowrap'
        }}>
          Initializing {Math.round(progress)} %
        </div>
      )}
    </Html>
  );
};

const ModelInner = ({
  url,
  fadeIn,
  onLoaded,
  scrollKeyframes
}) => {
  const outer = useRef(null);
  const inner = useRef(null);
  const { camera } = useThree();
  const scroll = useScroll();

  const ext = useMemo(() => url.split('.').pop().toLowerCase(), [url]);
  const content = useMemo(() => {
    let obj;
    if (ext === 'glb' || ext === 'gltf') obj = useGLTF(url).scene.clone();
    else if (ext === 'fbx') obj = useFBX(url).clone();
    else if (ext === 'obj') obj = useLoader(OBJLoader, url).clone();
    return obj;
  }, [url, ext]);

  useLayoutEffect(() => {
    if (!content) return;
    
    // 1. Reset transforms for measurement
    inner.current.position.set(0, 0, 0);
    inner.current.rotation.set(0, 0, 0);
    inner.current.scale.setScalar(1);
    outer.current.position.set(0, 0, 0);
    outer.current.rotation.set(0, 0, 0);

    // 2. Center geometry
    const box = new THREE.Box3().setFromObject(inner.current);
    const center = new THREE.Vector3();
    box.getCenter(center);
    
    // Move the content inside 'inner' so its bounding box center is at [0,0,0]
    inner.current.position.set(-center.x, -center.y, -center.z);

    // 3. Setup materials
    inner.current.traverse(o => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        if (fadeIn) {
          o.material.transparent = true;
          o.material.opacity = 0;
        }
      }
    });

    // 4. Set initial state from first keyframe if available
    if (scrollKeyframes && scrollKeyframes[0]) {
      const k = scrollKeyframes[0];
      outer.current.position.set(...k.position);
      outer.current.rotation.set(deg2rad(k.rotation[0]), deg2rad(k.rotation[1]), deg2rad(k.rotation[2]));
      inner.current.scale.setScalar(k.scale);
    }

    // 5. Fade In logic
    if (fadeIn) {
      let t = 0;
      const id = setInterval(() => {
        t += 0.04;
        const v = Math.min(t, 1);
        inner.current.traverse(o => {
          if (o.isMesh) o.material.opacity = v;
        });
        invalidate();
        if (v === 1) {
          clearInterval(id);
          onLoaded?.();
        }
      }, 16);
      return () => clearInterval(id);
    } else {
      onLoaded?.();
      invalidate();
    }
  }, [content, scrollKeyframes, fadeIn, onLoaded]);

  useFrame(() => {
    if (scrollKeyframes && scrollKeyframes.length > 1) {
      const offset = scroll.offset;
      const totalStages = scrollKeyframes.length - 1;
      const stage = Math.min(Math.floor(offset * totalStages), totalStages - 1);
      const stageProgress = (offset * totalStages) % 1;

      const k1 = scrollKeyframes[stage];
      const k2 = scrollKeyframes[stage + 1];

      // Interpolate Position
      outer.current.position.x = THREE.MathUtils.lerp(k1.position[0], k2.position[0], stageProgress);
      outer.current.position.y = THREE.MathUtils.lerp(k1.position[1], k2.position[1], stageProgress);
      outer.current.position.z = THREE.MathUtils.lerp(k1.position[2], k2.position[2], stageProgress);

      // Interpolate Rotation
      outer.current.rotation.x = THREE.MathUtils.lerp(deg2rad(k1.rotation[0]), deg2rad(k2.rotation[0]), stageProgress);
      outer.current.rotation.y = THREE.MathUtils.lerp(deg2rad(k1.rotation[1]), deg2rad(k2.rotation[1]), stageProgress);
      outer.current.rotation.z = THREE.MathUtils.lerp(deg2rad(k1.rotation[2]), deg2rad(k2.rotation[2]), stageProgress);

      // Interpolate Scale
      const s = THREE.MathUtils.lerp(k1.scale, k2.scale, stageProgress);
      inner.current.scale.setScalar(s);
      
      invalidate();
    }
  });

  if (!content) return null;
  return (
    <group ref={outer}>
      <group ref={inner}>
        <primitive object={content} />
      </group>
    </group>
  );
};

const ModelViewer = ({
  url,
  width = '100vw',
  height = '100vh',
  defaultZoom = 3.5,
  ambientIntensity = 0.4,
  keyLightIntensity = 1.2,
  fillLightIntensity = 0.6,
  rimLightIntensity = 0.8,
  environmentPreset = 'city',
  placeholderSrc,
  fadeIn = true,
  onModelLoaded,
  scrollPages = 0,
  scrollKeyframes = null,
  children
}) => {
  useEffect(() => void useGLTF.preload(url), [url]);

  return (
    <div style={{ width, height, position: 'relative', overflow: 'hidden', background: '#000' }}>
      <Canvas
        shadows
        frameloop="demand"
        gl={{ antialias: true, alpha: true, stencil: false, depth: true }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
        camera={{ fov: 30, position: [0, 0, defaultZoom], near: 0.1, far: 100 }}
      >
        {environmentPreset !== 'none' && <Environment preset={environmentPreset} />}

        <ambientLight intensity={ambientIntensity} />
        <spotLight position={[10, 20, 10]} angle={0.15} penumbra={1} intensity={keyLightIntensity} castShadow />
        <pointLight position={[-10, 10, -10]} intensity={fillLightIntensity} color="#c3d9f3" />
        <directionalLight position={[0, 5, -10]} intensity={rimLightIntensity} />

        <Suspense fallback={<Loader placeholderSrc={placeholderSrc} />}>
          <ScrollControls pages={scrollPages} damping={0.1}>
            <ModelInner
              url={url}
              fadeIn={fadeIn}
              onLoaded={onModelLoaded}
              scrollKeyframes={scrollKeyframes}
            />
            <Scroll html style={{ width: '100%' }}>
              {children}
            </Scroll>
          </ScrollControls>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ModelViewer;
