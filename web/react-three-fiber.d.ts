/// <reference types="react" />
/// <reference types="react-dom" />

// Type declarations for React Three Fiber JSX elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      planeGeometry: any;
      primitive: any;
      ambientLight: any;
      directionalLight: any;
      pointLight: any;
      threeGlobe: any;
    }
  }
}

export {};
