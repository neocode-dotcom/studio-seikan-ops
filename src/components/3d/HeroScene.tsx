import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

const CyberCore = () => {
    const groupRef = useRef<THREE.Group>(null);
    const coreRef = useRef<THREE.Mesh>(null);
    const particlesRef = useRef<THREE.Points>(null);
    const scrollRef = useRef(0);
    const maxScrollRef = useRef(1);

    useEffect(() => {
        const handleScroll = () => {
            scrollRef.current = window.scrollY;
            // The maximum scroll height
            maxScrollRef.current = Math.max(1, document.body.scrollHeight - window.innerHeight);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        // Initial setup
        setTimeout(handleScroll, 100); // Small delay to let initial layout settle
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Generate tech particles around the core
    const particleCount = 1500;
    const particlesPosition = useMemo(() => {
        const positions = new Float32Array(particleCount * 3);
        const radius = 8;
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * radius * 2;
            positions[i * 3 + 1] = (Math.random() - 0.5) * radius * 2;
            positions[i * 3 + 2] = (Math.random() - 0.5) * radius * 2;
        }
        return positions;
    }, []);

    useFrame(() => {
        if (!groupRef.current || !coreRef.current || !particlesRef.current) return;
        
        // Non-linear scroll progress (0 to 1)
        const progress = scrollRef.current / maxScrollRef.current;
        
        // 1. ROTATION - strictly tied to scroll
        const targetRotationY = progress * Math.PI * 6; // 3 full rotations
        const targetRotationX = progress * Math.PI * 2;
        
        // Smooth out the rotation so it eases nicely when the user stops scrolling
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.05);
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.05);

        // 2. SCALE AND SHAPE based on sections
        let targetScale = 1;
        let pScale = 1;
        let targetColor = new THREE.Color("#c4ff23"); // Default Neon Green

        if (progress < 0.2) {
            // Hero: Solid, compact core
            targetScale = 1.2 + progress;
            pScale = 1;
        } else if (progress < 0.4) {
            // Problem: Chaotic size, red/orange tint
            targetScale = 2.5 - (progress - 0.2) * 5;
            pScale = 1 + (progress - 0.2) * 3;
            targetColor.lerp(new THREE.Color("#ff3333"), (progress - 0.2) * 5);
        } else if (progress < 0.7) {
            // Solution: Expanding net, blueish/green
            targetScale = 1 + (progress - 0.4) * 2;
            pScale = 0.5;
            targetColor.lerp(new THREE.Color("#00ffcc"), (progress - 0.4) * 3);
        } else {
            // Method & Footer: Perfect alignment, large
            targetScale = 1.5 - (progress - 0.7);
            pScale = 0.2;
            targetColor.lerp(new THREE.Color("#ffffff"), (progress - 0.7) * 3);
        }

        // Apply scales with lerp for smoothness
        coreRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);
        particlesRef.current.scale.lerp(new THREE.Vector3(pScale, pScale, pScale), 0.05);
        
        // Apply color
        const material = coreRef.current.material as THREE.MeshStandardMaterial;
        material.color.lerp(targetColor, 0.05);
        material.emissive.lerp(targetColor, 0.05);
        
        const pMaterial = particlesRef.current.material as THREE.PointsMaterial;
        pMaterial.color.lerp(targetColor, 0.05);
    });

    return (
        <group ref={groupRef}>
            {/* Tech Core */}
            <mesh ref={coreRef}>
                <icosahedronGeometry args={[1.5, 2]} />
                <meshStandardMaterial 
                    color="#c4ff23" 
                    emissive="#c4ff23"
                    emissiveIntensity={0.6}
                    wireframe={true} 
                    transparent 
                    opacity={0.3}
                />
            </mesh>
            
            {/* Inner solid core highlight */}
            <mesh>
                 <octahedronGeometry args={[0.8, 0]} />
                 <meshStandardMaterial color="#050505" emissive="#111111" />
            </mesh>

            {/* Particle Field */}
            <points ref={particlesRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={particleCount}
                        args={[particlesPosition, 3]}
                    />
                </bufferGeometry>
                <pointsMaterial size={0.03} color="#ffffff" transparent opacity={0.4} sizeAttenuation={true} />
            </points>
        </group>
    );
};

const HeroScene = () => {
    return (
        <div className="fixed inset-0 -z-10 bg-[#050505]">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <color attach="background" args={['#030303']} />
                
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#c4ff23" />
                
                <CyberCore />
                
                <Environment preset="city" />
            </Canvas>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030303]/40 to-[#030303]/90 pointer-events-none" />
        </div>
    );
};

export default HeroScene;
