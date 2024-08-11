import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const ThreeJSComponent = () => {
    const containerRef = useRef();
    const groupRef = useRef();

    useEffect(() => {
        let group;
        let camera, scene, renderer;
        let positions, colors;
        let particles;
        let pointCloud;
        let particlePositions;
        let linesMesh;

        const particlesData = [];
        const maxParticleCount = 1500;
        let particleCount = 500;
        const r = 800;
        const rHalf = r / 2;

        const effectController = {
            minDistance: 50,
            maxMinDistance: 150,
            limitConnections: true,
            maxConnections: 10,
        };

        const init = () => {
            camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 4000);
            camera.position.z = 2000;

            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x000022);

            group = new THREE.Group();
            groupRef.current = group;
            scene.add(group);

            const segments = maxParticleCount * maxParticleCount;

            positions = new Float32Array(segments * 3);
            colors = new Float32Array(segments * 3);

            const pMaterial = new THREE.PointsMaterial({
                color: 0xffaa00,
                size: 5,
                blending: THREE.AdditiveBlending,
                transparent: true,
                sizeAttenuation: true,
            });

            particles = new THREE.BufferGeometry();
            particlePositions = new Float32Array(maxParticleCount * 3);

            for (let i = 0; i < maxParticleCount; i++) {
                const theta = Math.random() * 2 * Math.PI;
                const phi = Math.random() * Math.PI;
                const radius = Math.random() * r;

                const x = radius * Math.sin(phi) * Math.cos(theta);
                const y = radius * Math.sin(phi) * Math.sin(theta);
                const z = radius * Math.cos(phi);

                particlePositions[i * 3] = x;
                particlePositions[i * 3 + 1] = y;
                particlePositions[i * 3 + 2] = z;

                particlesData.push({
                    velocity: new THREE.Vector3(
                        -0.5 + Math.random() * 1.5,
                        -0.5 + Math.random() * 1.5,
                        -0.5 + Math.random() * 1.5
                    ),
                    numConnections: 0,
                });
            }

            particles.setDrawRange(0, particleCount);
            particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3).setUsage(THREE.DynamicDrawUsage));

            pointCloud = new THREE.Points(particles, pMaterial);
            group.add(pointCloud);

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3).setUsage(THREE.DynamicDrawUsage));
            geometry.computeBoundingSphere();
            geometry.setDrawRange(0, 0);

            const material = new THREE.LineBasicMaterial({
                vertexColors: true,
                blending: THREE.AdditiveBlending,
                transparent: true,
                linewidth: 2,
            });

            linesMesh = new THREE.LineSegments(geometry, material);
            group.add(linesMesh);

            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setAnimationLoop(animate);
            if (containerRef.current) {
                containerRef.current.appendChild(renderer.domElement);
            }

            window.addEventListener('resize', onWindowResize);

            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableZoom = false; // Disable zooming
            controls.enablePan = false; // Disable panning if needed
            controls.minDistance = 1000;
            controls.maxDistance = 3000;

            // Scroll event listener to move the group on scroll
            window.addEventListener('scroll', onScroll);
        };

        const onScroll = () => {
            const scrollY = window.scrollY;
            const newPositionX = scrollY * 0.5;
            if (groupRef.current) {
                groupRef.current.position.x = newPositionX;
            }
        };

        const onWindowResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        const animate = () => {
            let vertexpos = 0;
            let colorpos = 0;
            let numConnected = 0;

            effectController.minDistance = Math.min(effectController.maxMinDistance, effectController.minDistance + 0.5);

            if (particleCount < maxParticleCount) {
                particleCount += 5;
                particles.setDrawRange(0, particleCount);
            }

            for (let i = 0; i < particleCount; i++) {
                particlesData[i].numConnections = 0;
            }

            for (let i = 0; i < particleCount; i++) {
                const particleData = particlesData[i];

                particlePositions[i * 3] += particleData.velocity.x * 2;
                particlePositions[i * 3 + 1] += particleData.velocity.y * 2;
                particlePositions[i * 3 + 2] += particleData.velocity.z * 2;

                if (particlePositions[i * 3 + 1] < -rHalf || particlePositions[i * 3 + 1] > rHalf) {
                    particleData.velocity.y = -particleData.velocity.y;
                }

                if (particlePositions[i * 3] < -rHalf || particlePositions[i * 3] > rHalf) {
                    particleData.velocity.x = -particleData.velocity.x;
                }

                if (particlePositions[i * 3 + 2] < -rHalf || particlePositions[i * 3 + 2] > rHalf) {
                    particleData.velocity.z = -particleData.velocity.z;
                }

                if (effectController.limitConnections && particleData.numConnections >= effectController.maxConnections) {
                    continue;
                }

                for (let j = i + 1; j < particleCount; j++) {
                    const particleDataB = particlesData[j];
                    if (effectController.limitConnections && particleDataB.numConnections >= effectController.maxConnections) {
                        continue;
                    }

                    const dx = particlePositions[i * 3] - particlePositions[j * 3];
                    const dy = particlePositions[i * 3 + 1] - particlePositions[j * 3 + 1];
                    const dz = particlePositions[i * 3 + 2] - particlePositions[j * 3 + 2];
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    if (dist < effectController.minDistance) {
                        particleData.numConnections++;
                        particleDataB.numConnections++;

                        const alpha = 1.0 - dist / effectController.minDistance;

                        positions[vertexpos++] = particlePositions[i * 3];
                        positions[vertexpos++] = particlePositions[i * 3 + 1];
                        positions[vertexpos++] = particlePositions[i * 3 + 2];

                        positions[vertexpos++] = particlePositions[j * 3];
                        positions[vertexpos++] = particlePositions[j * 3 + 1];
                        positions[vertexpos++] = particlePositions[j * 3 + 2];

                        colors[colorpos++] = 1.0;
                        colors[colorpos++] = alpha;
                        colors[colorpos++] = 0.0;

                        colors[colorpos++] = 1.0;
                        colors[colorpos++] = alpha;
                        colors[colorpos++] = 0.0;

                        numConnected++;
                    }
                }
            }

            linesMesh.geometry.setDrawRange(0, numConnected * 2);
            linesMesh.geometry.attributes.position.needsUpdate = true;
            linesMesh.geometry.attributes.color.needsUpdate = true;

            pointCloud.geometry.attributes.position.needsUpdate = true;

            render();
        };

        const render = () => {
            const time = Date.now() * 0.001;
            group.rotation.y = time * 0.2;
            renderer.render(scene, camera);
        };

        init();

        return () => {
            window.removeEventListener('resize', onWindowResize);
            window.removeEventListener('scroll', onScroll);
            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    return <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100vh' }} />;
};

export default ThreeJSComponent;
