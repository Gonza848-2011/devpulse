import * as THREE from 'three';
import React, {
  Suspense,
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  ContactShadows,
  Float,
  MeshDistortMaterial,
  MeshWobbleMaterial,
  MeshTransmissionMaterial,
  RoundedBox,
  Html,
  Text,
  Float as FloatDrei,
  Grid,
  Stars,
} from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  Noise,
  Vignette,
  ChromaticAberration,
  Glitch,
  Scanline,
} from '@react-three/postprocessing';
import { motion, AnimatePresence } from 'motion/react';
import {
  Box,
  Circle,
  Database,
  Rotate3d,
  Maximize2,
  Download,
  RefreshCw,
  Zap,
  Palette,
  Sparkles,
  Image as ImageIcon,
  Sliders,
  Wand2,
  Triangle,
  Hexagon,
  Layers,
  Infinity as InfinityIcon,
  Gem,
  Pyramid,
  Pill,
  CircleDashed,
  Square,
  Disc,
  Move,
  Eye,
  Sun,
  Ghost,
  Plus,
  Trash2,
  Settings,
  AlertCircle,
  Camera,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

// Definimos tipos para las props de AnimatedShape
interface SceneObject {
  id: string;
  type: string;
  color: string;
  distort: number;
  speed: number;
  scale: number;
  metalness: number;
  roughness: number;
  transmission: number;
  wireframe: boolean;
  emissive: string;
  emissiveIntensity: number;
  opacity: number;
  clearcoat: number;
  clearcoatRoughness: number;
  rotation: [number, number, number];
  position: [number, number, number];
  miniObjectsCount: number;
  miniObjectsShape: string;
  miniObjectsColor: string;
  animationMode: 'orbit' | 'pulse' | 'float' | 'static';
  modification: 'none' | 'spikes' | 'wireframe-glow' | 'glitch';
}

interface AnimatedShapeProps extends SceneObject {
  isSelected?: boolean;
  onSelect?: () => void;
}

// Componente memoizado para evitar rerenderizados innecesarios
const AnimatedShape = React.memo(
  ({
    type,
    color,
    distort,
    speed,
    scale,
    metalness,
    roughness,
    transmission,
    wireframe,
    emissive,
    emissiveIntensity,
    opacity,
    clearcoat,
    clearcoatRoughness,
    rotation,
    position,
    miniObjectsCount,
    miniObjectsShape,
    miniObjectsColor,
    animationMode,
    modification,
    isSelected,
    onSelect,
  }: AnimatedShapeProps) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const groupRef = useRef<THREE.Group>(null);
    const spikesRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
      if (!meshRef.current || !groupRef.current) return;
      const time = state.clock.getElapsedTime();
      
      const targetScale = (hovered || isSelected) ? scale * 1.1 : scale;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

      if (animationMode === 'orbit') {
        meshRef.current.rotation.y = time * 0.5 * speed;
        meshRef.current.position.x = position[0] + Math.cos(time * 0.5 * speed) * 0.5;
        meshRef.current.position.z = position[2] + Math.sin(time * 0.5 * speed) * 0.5;
      } else if (animationMode === 'pulse') {
        const s = 1 + Math.sin(time * 2 * speed) * 0.1;
        meshRef.current.scale.set(s * targetScale, s * targetScale, s * targetScale);
        meshRef.current.rotation.y += 0.01 * speed;
      } else if (animationMode === 'float') {
        meshRef.current.position.y = position[1] + Math.sin(time * speed) * 0.2;
        meshRef.current.rotation.x += 0.002 * speed;
        meshRef.current.rotation.y += 0.003 * speed;
      }

      if (modification === 'glitch') {
        meshRef.current.visible = Math.random() > 0.05;
        if (Math.random() > 0.95) {
          meshRef.current.position.x += (Math.random() - 0.5) * 0.2;
        } else {
          meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, position[0], 0.1);
        }
      }

      groupRef.current.rotation.y = time * 0.2 * speed;
      if (spikesRef.current) {
        spikesRef.current.rotation.copy(meshRef.current.rotation);
        spikesRef.current.position.copy(meshRef.current.position);
        spikesRef.current.scale.copy(meshRef.current.scale);
      }
    });

    // Memorizamos las props del material para evitar recrear objetos en cada render
    const materialProps = useMemo(
      () => ({
        color,
        metalness,
        roughness,
        wireframe,
        emissive,
        emissiveIntensity,
        opacity,
        transparent: opacity < 1 || transmission > 0,
        clearcoat,
        clearcoatRoughness,
      }),
      [
        color,
        metalness,
        roughness,
        wireframe,
        emissive,
        emissiveIntensity,
        opacity,
        transmission,
        clearcoat,
        clearcoatRoughness,
      ]
    );

    // Memorizamos la geometría principal según el tipo
    const mainGeometry = useMemo(() => {
      switch (type) {
        case 'box':
          return <boxGeometry args={[1.5, 1.5, 1.5]} />;
        case 'sphere':
          return <sphereGeometry args={[1, 64, 64]} />;
        case 'cylinder':
          return <cylinderGeometry args={[0.8, 0.8, 2, 32]} />;
        case 'torus':
          return <torusGeometry args={[0.8, 0.3, 16, 100]} />;
        case 'cone':
          return <coneGeometry args={[1, 2, 32]} />;
        case 'icosahedron':
          return <icosahedronGeometry args={[1, 0]} />;
        case 'torusKnot':
          return <torusKnotGeometry args={[0.6, 0.2, 128, 32]} />;
        case 'octahedron':
          return <octahedronGeometry args={[1, 0]} />;
        case 'tetrahedron':
          return <tetrahedronGeometry args={[1, 0]} />;
        case 'dodecahedron':
          return <dodecahedronGeometry args={[1, 0]} />;
        case 'capsule':
          return <capsuleGeometry args={[0.5, 1, 4, 16]} />;
        case 'ring':
          return <ringGeometry args={[0.5, 1, 32]} />;
        case 'circle':
          return <circleGeometry args={[1, 32]} />;
        case 'plane':
          return <planeGeometry args={[2, 2]} />;
        default:
          return <sphereGeometry args={[1, 64, 64]} />;
      }
    }, [type]);

    // Memorizamos la geometría de mini objetos
    const miniGeometry = useMemo(() => {
      switch (miniObjectsShape) {
        case 'cone':
          return <coneGeometry args={[0.15, 0.4, 16]} />;
        case 'box':
          return <boxGeometry args={[0.2, 0.2, 0.2]} />;
        case 'pyramid':
          return <coneGeometry args={[0.2, 0.4, 4]} />;
        default:
          return <sphereGeometry args={[0.15, 16, 16]} />;
      }
    }, [miniObjectsShape]);

    const renderMaterial = () => {
      if (transmission > 0) {
        return (
          <MeshTransmissionMaterial
            {...materialProps}
            transmission={transmission}
            thickness={0.5}
            chromaticAberration={0.06}
            anisotropy={0.1}
          />
        );
      }
      if (distort > 0) {
        if (type === 'sphere') {
          return (
            <MeshDistortMaterial
              {...materialProps}
              speed={speed}
              distort={distort}
            />
          );
        }
        return (
          <MeshWobbleMaterial
            {...materialProps}
            factor={distort}
            speed={speed}
          />
        );
      }
      return <meshStandardMaterial {...materialProps} />;
    };

    return (
      <Float speed={speed * 0.5} rotationIntensity={0.2} floatIntensity={0.2}>
        <group position={position}>
          <mesh 
            ref={meshRef} 
            scale={scale} 
            rotation={rotation}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.();
            }}
          >
            {type === 'roundedBox' ? (
              <RoundedBox args={[1.5, 1.5, 1.5]} radius={0.1} smoothness={4}>
                {renderMaterial()}
              </RoundedBox>
            ) : (
              <>
                {mainGeometry}
                {renderMaterial()}
              </>
            )}
            {isSelected && (
              <mesh scale={1.1}>
                {type === 'roundedBox' ? <boxGeometry args={[1.5, 1.5, 1.5]} /> : mainGeometry}
                <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.3} />
              </mesh>
            )}
          </mesh>

          {/* Spikes modification */}
          {modification === 'spikes' && (
            <group ref={spikesRef}>
              {Array.from({ length: 40 }).map((_, i) => {
                const phi = Math.acos(-1 + (2 * i) / 40);
                const theta = Math.sqrt(40 * Math.PI) * phi;
                const r = scale * 0.8;
                const x = r * Math.sin(phi) * Math.cos(theta);
                const y = r * Math.sin(phi) * Math.sin(theta);
                const z = r * Math.cos(phi);
                return (
                  <mesh key={i} position={[x, y, z]} rotation={[phi, theta, 0]}>
                    <coneGeometry args={[0.05, 0.4, 8]} />
                    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
                  </mesh>
                );
              })}
            </group>
          )}

          {/* Mini objetos solo si hay count > 0 */}
          {miniObjectsCount > 0 && (
            <group ref={groupRef}>
              {Array.from({ length: miniObjectsCount }).map((_, i) => {
                const angle = (i / miniObjectsCount) * Math.PI * 2;
                const radius = scale * 1.2;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                const y = Math.sin(angle * 2) * 0.2;
                return (
                  <mesh
                    key={i}
                    position={[x, y, z]}
                    rotation={[0, 0, angle + Math.PI / 2]}
                  >
                    {miniGeometry}
                    <meshStandardMaterial
                      color={miniObjectsColor}
                      emissive={miniObjectsColor}
                      emissiveIntensity={1}
                    />
                  </mesh>
                );
              })}
            </group>
          )}
        </group>
      </Float>
    );
  }
);

AnimatedShape.displayName = 'AnimatedShape';

export const Studio3D = () => {
  const { t, language } = useLanguage();
  
  // Scene State
  const DEFAULT_OBJECT: Omit<SceneObject, 'id'> = {
    type: 'sphere',
    color: '#6366f1',
    distort: 0.4,
    speed: 2,
    scale: 1,
    metalness: 0.5,
    roughness: 0.2,
    transmission: 0,
    wireframe: false,
    emissive: '#000000',
    emissiveIntensity: 1,
    opacity: 1,
    clearcoat: 0,
    clearcoatRoughness: 0,
    rotation: [0, 0, 0],
    position: [0, 0, 0],
    miniObjectsCount: 0,
    miniObjectsShape: 'sphere',
    miniObjectsColor: '#ffffff',
    animationMode: 'float',
    modification: 'none'
  };

  const [sceneObjects, setSceneObjects] = useState<SceneObject[]>([
    { ...DEFAULT_OBJECT, id: 'obj_0' }
  ]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>('obj_0');

  // Global Scene State
  const [bloomIntensity, setBloomIntensity] = useState(1.5);
  const [chromaticAberration, setChromaticAberration] = useState(0.002);
  const [noiseOpacity, setNoiseOpacity] = useState(0.05);
  const [glitchIntensity, setGlitchIntensity] = useState(0);
  const [scanlineOpacity, setScanlineOpacity] = useState(0);
  const [env, setEnv] = useState<any>('city');
  const [bgImage, setBgImage] = useState<string | null>(null);

  // UI State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);

  const selectedObject = useMemo(() => 
    sceneObjects.find(obj => obj.id === selectedObjectId) || sceneObjects[0],
  [sceneObjects, selectedObjectId]);

  const updateSelectedObject = (updates: Partial<SceneObject>) => {
    setSceneObjects(prev => prev.map(obj => 
      obj.id === selectedObjectId ? { ...obj, ...updates } : obj
    ));
  };

  // Limpiar objeto URL al desmontar o cambiar imagen
  useEffect(() => {
    return () => {
      if (bgImage) URL.revokeObjectURL(bgImage);
    };
  }, [bgImage]);

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Revocar URL anterior si existe
      if (bgImage) URL.revokeObjectURL(bgImage);
      const url = URL.createObjectURL(file);
      setBgImage(url);
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim() || isAiThinking) return;
    setIsAiThinking(true);
    setAiError(null);

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const currentState = {
      objects: sceneObjects,
      global: {
        bloomIntensity,
        chromaticAberration,
        env,
        glitchIntensity,
        scanlineOpacity,
        noiseOpacity
      }
    };

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `Current Scene State: ${JSON.stringify(currentState)}
        User Request: "${aiPrompt}"
        User Language: ${language === 'es' ? 'Spanish' : 'English'}
        
        Architectural Directives:
        1. Scene Composition: Create visually striking arrangements using up to 5 objects. Use 'position' and 'scale' to create depth and hierarchy.
        2. Material Mastery: Leverage 'metalness', 'roughness', 'transmission', and 'clearcoat' to create realistic or surreal materials (glass, chrome, matte, etc.).
        3. Dynamic Motion: Use 'animationMode' ('orbit', 'pulse', 'float', 'static') and 'speed' to bring the scene to life.
        4. Visual Effects: Adjust 'bloomIntensity' (0-5), 'chromaticAberration' (0-0.02), 'glitchIntensity' (0-1), 'scanlineOpacity' (0-1), and 'noiseOpacity' (0-0.2) to match the mood.
        5. Atmosphere: Choose an 'env' preset: 'city', 'night', 'warehouse', 'forest', 'apartment', 'studio', 'park', 'lobby'.
        6. Object Modifications: Use 'modification' ('none', 'spikes', 'wireframe-glow', 'glitch') for advanced visual styles.
        7. Provide a short, formal, and highly professional message in ${language === 'es' ? 'Spanish' : 'English'} explaining your architectural decisions.
        
        Return ONLY a JSON object with:
        - objects: Array of SceneObject (all fields required)
        - global: { bloomIntensity, glitchIntensity, scanlineOpacity, noiseOpacity, env }
        - message: A string with your response in ${language === 'es' ? 'Spanish' : 'English'}`,
        config: {
          systemInstruction: "You are a professional 3D Scene Architect. Your goal is to create or modify 3D scenes based on user requests. You must always return a valid JSON object following the provided schema. Be creative with materials, lighting, and composition.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              objects: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    type: { type: Type.STRING },
                    color: { type: Type.STRING },
                    distort: { type: Type.NUMBER },
                    speed: { type: Type.NUMBER },
                    scale: { type: Type.NUMBER },
                    metalness: { type: Type.NUMBER },
                    roughness: { type: Type.NUMBER },
                    transmission: { type: Type.NUMBER },
                    wireframe: { type: Type.BOOLEAN },
                    emissive: { type: Type.STRING },
                    emissiveIntensity: { type: Type.NUMBER },
                    opacity: { type: Type.NUMBER },
                    clearcoat: { type: Type.NUMBER },
                    clearcoatRoughness: { type: Type.NUMBER },
                    rotation: { type: Type.ARRAY, items: { type: Type.NUMBER } },
                    position: { type: Type.ARRAY, items: { type: Type.NUMBER } },
                    miniObjectsCount: { type: Type.NUMBER },
                    miniObjectsShape: { type: Type.STRING },
                    miniObjectsColor: { type: Type.STRING },
                    animationMode: { type: Type.STRING },
                    modification: { type: Type.STRING },
                  },
                  required: ["id", "type", "color", "distort", "speed", "scale", "metalness", "roughness", "transmission", "wireframe", "emissive", "emissiveIntensity", "opacity", "clearcoat", "clearcoatRoughness", "rotation", "position", "miniObjectsCount", "miniObjectsShape", "miniObjectsColor", "animationMode", "modification"]
                }
              },
              global: {
                type: Type.OBJECT,
                properties: {
                  bloomIntensity: { type: Type.NUMBER },
                  glitchIntensity: { type: Type.NUMBER },
                  scanlineOpacity: { type: Type.NUMBER },
                  noiseOpacity: { type: Type.NUMBER },
                  env: { type: Type.STRING },
                },
                required: ["bloomIntensity", "glitchIntensity", "scanlineOpacity", "noiseOpacity", "env"]
              },
              message: { type: Type.STRING }
            },
            required: ["objects", "global", "message"]
          }
        }
      });

      if (!response.text) {
        throw new Error('La IA no devolvió ninguna respuesta. Por favor, intenta de nuevo.');
      }

      let data;
      try {
        data = JSON.parse(response.text);
      } catch (parseError) {
        console.error('JSON Parse Error:', response.text);
        throw new Error('La respuesta de la IA no tiene el formato correcto. Por favor, intenta de nuevo.');
      }

      if (!data.objects || !data.global) {
        throw new Error('La respuesta de la IA está incompleta. Por favor, intenta de nuevo.');
      }

      setCommandHistory(prev => [aiPrompt, ...prev].slice(0, 5));
      setSceneObjects(data.objects);
      setAiMessage(data.message);
      setAiPrompt(''); // Limpiar el prompt después de generar
      setAiError(null);
      if (data.objects.length > 0 && !data.objects.find((o: any) => o.id === selectedObjectId)) {
        setSelectedObjectId(data.objects[0].id);
      }
      setBloomIntensity(data.global.bloomIntensity);
      setGlitchIntensity(data.global.glitchIntensity);
      setScanlineOpacity(data.global.scanlineOpacity);
      setNoiseOpacity(data.global.noiseOpacity);
      setEnv(data.global.env);
    } catch (error: any) {
      console.error('AI 3D Error:', error);
      if (error.message?.includes('429') || error.message?.toLowerCase().includes('rate')) {
        setAiError('Límite de peticiones excedido. Por favor, espera un minuto antes de intentar de nuevo.');
      } else {
        setAiError(error instanceof Error ? error.message : 'Error desconocido al conectar con la IA');
      }
    } finally {
      setIsAiThinking(false);
    }
  };

  // Handlers con useCallback para evitar recreaciones
  const handleWireframeToggle = useCallback(() => updateSelectedObject({ wireframe: !selectedObject.wireframe }), [selectedObject]);
  const handleColorChange = useCallback((hex: string) => updateSelectedObject({ color: hex }), []);
  const handleShapeChange = useCallback((id: string) => updateSelectedObject({ type: id }), []);
  const handleEnvChange = useCallback((id: string) => setEnv(id), []);

  // Datos estáticos (podrían moverse fuera del componente)
  const colors = [
    { name: 'Indigo', hex: '#6366f1' },
    { name: 'Rose', hex: '#f43f5e' },
    { name: 'Emerald', hex: '#10b981' },
    { name: 'Amber', hex: '#f59e0b' },
    { name: 'Sky', hex: '#0ea5e9' },
    { name: 'Zinc', hex: '#18181b' },
    { name: 'White', hex: '#ffffff' },
    { name: 'Black', hex: '#000000' },
    { name: 'Violet', hex: '#8b5cf6' },
  ];

  const shapes = [
    { id: 'box', icon: Box },
    { id: 'sphere', icon: Circle },
    { id: 'cylinder', icon: Database },
    { id: 'torus', icon: Rotate3d },
    { id: 'cone', icon: Triangle },
    { id: 'icosahedron', icon: Hexagon },
    { id: 'torusKnot', icon: InfinityIcon },
    { id: 'octahedron', icon: Gem },
    { id: 'tetrahedron', icon: Pyramid },
    { id: 'dodecahedron', icon: Hexagon },
    { id: 'capsule', icon: Pill },
    { id: 'ring', icon: CircleDashed },
    { id: 'roundedBox', icon: Square },
    { id: 'circle', icon: Disc },
    { id: 'plane', icon: Square },
  ];

  const miniShapes = [
    { id: 'sphere', icon: Circle },
    { id: 'cone', icon: Triangle },
    { id: 'box', icon: Box },
    { id: 'pyramid', icon: Pyramid },
  ];

  const envs = [
    { id: 'city', label: 'City' },
    { id: 'sunset', label: 'Sunset' },
    { id: 'forest', label: 'Forest' },
    { id: 'apartment', label: 'Apartment' },
    { id: 'studio', label: 'Studio' },
    { id: 'park', label: 'Park' },
    { id: 'night', label: 'Night' },
  ];

  const materialPresets = [
    { name: 'Glass', props: { transmission: 1, roughness: 0, metalness: 0, clearcoat: 1, opacity: 0.3 } },
    { name: 'Chrome', props: { transmission: 0, roughness: 0, metalness: 1, clearcoat: 1, opacity: 1 } },
    { name: 'Plastic', props: { transmission: 0, roughness: 0.5, metalness: 0, clearcoat: 0.2, opacity: 1 } },
    { name: 'Neon', props: { transmission: 0, roughness: 1, metalness: 0, emissiveIntensity: 2, opacity: 1 } },
    { name: 'Hologram', props: { transmission: 0.5, roughness: 0, metalness: 0, wireframe: true, opacity: 0.5 } },
  ];

  const applyPreset = (preset: any) => {
    updateSelectedObject(preset.props);
  };

  const resetScene = () => {
    setSceneObjects([{
      id: 'obj_0',
      type: 'sphere',
      color: '#6366f1',
      distort: 0.4,
      speed: 2,
      scale: 1,
      metalness: 0.5,
      roughness: 0.2,
      transmission: 0,
      wireframe: false,
      emissive: '#000000',
      emissiveIntensity: 1,
      opacity: 1,
      clearcoat: 0,
      clearcoatRoughness: 0,
      rotation: [0, 0, 0],
      position: [0, 0, 0],
      miniObjectsCount: 0,
      miniObjectsShape: 'sphere',
      miniObjectsColor: '#ffffff',
      animationMode: 'float',
      modification: 'none'
    }]);
    setSelectedObjectId('obj_0');
    setBloomIntensity(1.5);
    setGlitchIntensity(0);
    setScanlineOpacity(0);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400 font-sans selection:bg-indigo-500/30 overflow-hidden">
      <div className="p-4 md:p-6 max-w-[1800px] mx-auto h-screen flex flex-col gap-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative w-12 h-12 bg-black rounded-xl border border-white/10 flex items-center justify-center shadow-2xl">
                <Rotate3d className="w-7 h-7 text-indigo-500" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-white flex items-center gap-3">
                STUDIO_3D <span className="text-[9px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-zinc-500 uppercase tracking-widest">v2.1.0_PRO</span>
              </h1>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-[10px] font-mono text-zinc-600 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                  SYSTEM_STABLE
                </span>
                <div className="w-px h-2 bg-zinc-800" />
                <span className="text-[10px] font-mono text-zinc-600">CORE_TEMP: 42°C</span>
                <div className="w-px h-2 bg-zinc-800" />
                <span className="text-[10px] font-mono text-zinc-600 uppercase">Engine: Gemini_3.1</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-black/40 border border-white/5 p-1 rounded-lg backdrop-blur-md">
              <button
                onClick={resetScene} 
                className="px-4 py-2 rounded-md text-[10px] font-mono font-bold hover:bg-white/5 transition-all flex items-center gap-2 text-zinc-500 hover:text-white"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                PURGE_SCENE
              </button>
              <div className="w-px h-4 bg-white/5 self-center mx-1" />
              <button
                onClick={() => {}} 
                className="px-4 py-2 rounded-md text-[10px] font-mono font-bold hover:bg-white/5 transition-all flex items-center gap-2 text-zinc-500 hover:text-white"
              >
                <Download className="w-3.5 h-3.5" />
                EXPORT_JSON
              </button>
            </div>
            <button className="w-10 h-10 rounded-full border border-white/10 bg-black flex items-center justify-center hover:bg-white/5 transition-all">
              <Settings className="w-4 h-4 text-zinc-400" />
            </button>
          </div>
        </header>

        <main className="flex-grow grid grid-cols-12 gap-6 overflow-hidden">
          {/* Left Sidebar: Parameters */}
          <aside className="col-span-3 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
            {/* Scene Outliner */}
            <div className="bg-zinc-900/20 border border-white/5 rounded-2xl p-6 space-y-5 backdrop-blur-xl relative overflow-hidden group/outliner">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover/outliner:opacity-100 transition-opacity" />
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2.5">
                  <Database className="w-3.5 h-3.5 text-indigo-500" />
                  SCENE_OUTLINER
                </h3>
                <button 
                  onClick={() => {
                    if (sceneObjects.length >= 5) return;
                    const newId = `obj_${Date.now()}`;
                    setSceneObjects(prev => [...prev, {
                      ...DEFAULT_OBJECT,
                      id: newId,
                      position: [(Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4]
                    }]);
                    setSelectedObjectId(newId);
                  }}
                  disabled={sceneObjects.length >= 5}
                  className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                  title="Add Object (Max 5)"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-1">
                {sceneObjects.map((obj) => (
                  <div key={obj.id} className="group/item relative">
                    <button
                      onClick={() => setSelectedObjectId(obj.id)}
                      className={cn(
                        "w-full px-4 py-3 rounded-xl border text-[10px] font-mono flex items-center justify-between transition-all pr-10",
                        selectedObjectId === obj.id 
                          ? "bg-indigo-500/10 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.1)] text-indigo-200" 
                          : "bg-white/5 border-white/5 text-zinc-500 hover:border-white/10"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)]" style={{ backgroundColor: obj.color }} />
                        <span className="font-bold tracking-wider">
                          {obj.id.split('_')[0].toUpperCase()}_{obj.id.slice(-4)}
                        </span>
                      </div>
                      <span className="text-[8px] opacity-40 uppercase tracking-widest">{obj.type}</span>
                    </button>
                    {sceneObjects.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSceneObjects(prev => {
                            const filtered = prev.filter(o => o.id !== obj.id);
                            if (selectedObjectId === obj.id) {
                              setSelectedObjectId(filtered[0].id);
                            }
                            return filtered;
                          });
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-rose-500/20 text-zinc-600 hover:text-rose-400 opacity-0 group-hover/item:opacity-100 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Architect Panel */}
            <div className="bg-zinc-900/20 border border-white/5 rounded-2xl p-6 space-y-5 backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2.5">
                  <Wand2 className="w-3.5 h-3.5 text-indigo-500" />
                  AI_ARCHITECT
                </h3>
                <div className="flex gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-zinc-800" />
                  <div className="w-1 h-1 rounded-full bg-zinc-800" />
                  <div className="w-1 h-1 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                </div>
              </div>
              
              <div className="relative">
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAiGenerate();
                    }
                  }}
                  placeholder={language === 'es' ? "Describe tu visión..." : "Describe your vision..."}
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-sm font-sans font-medium text-indigo-100 outline-none focus:border-indigo-500/40 focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none placeholder:text-zinc-800 min-h-[240px] leading-relaxed relative z-10"
                />
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <kbd className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[8px] font-mono text-zinc-600">ENTER</kbd>
                </div>
              </div>

              <AnimatePresence>
                {aiMessage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl space-y-2"
                  >
                    <div className="flex items-center gap-2 text-[9px] font-mono text-indigo-400 font-bold uppercase tracking-widest">
                      <Sparkles className="w-3 h-3" />
                      AI_RESPONSE
                    </div>
                    <p className="text-xs font-sans font-medium text-indigo-200/80 leading-relaxed italic">
                      "{aiMessage}"
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {aiError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-rose-400 text-[10px] font-sans font-semibold p-3 bg-rose-500/5 border border-rose-500/20 rounded-xl flex items-start gap-2"
                >
                  <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                  <span>ERR: {aiError.toUpperCase()}</span>
                </motion.div>
              )}

              {commandHistory.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest font-bold">History</p>
                  <div className="flex flex-wrap gap-1.5">
                    {commandHistory.map((cmd, i) => (
                      <button
                        key={i}
                        onClick={() => setAiPrompt(cmd)}
                        className="px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-[9px] font-sans font-medium text-zinc-500 hover:text-indigo-400 hover:border-indigo-500/30 transition-all truncate max-w-[120px]"
                      >
                        {cmd}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleAiGenerate}
                disabled={isAiThinking || !aiPrompt.trim()}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-sans text-xs font-bold hover:bg-indigo-500 disabled:opacity-20 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-500/20 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                {isAiThinking ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    {language === 'es' ? 'SINTETIZANDO...' : 'SYNTHESIZING...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 group-hover:scale-125 transition-transform" />
                    {language === 'es' ? 'GENERAR ESCENA' : 'GENERATE SCENE'}
                  </>
                )}
              </button>
            </div>

            {/* Manual Controls */}
            <div className="space-y-6">
              {/* Geometry & Presets */}
              <div className="bg-zinc-900/20 border border-white/5 rounded-2xl p-6 space-y-7 backdrop-blur-xl">
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2.5">
                      <Box className="w-3.5 h-3.5 text-indigo-500" />
                      GEOMETRY_TYPE
                    </h3>
                    <span className="text-[9px] font-mono text-indigo-400/60 bg-indigo-500/5 px-2 py-0.5 rounded-full border border-indigo-500/10">
                      {selectedObject.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {shapes.slice(0, 10).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleShapeChange(item.id)}
                        className={cn(
                          'p-2.5 rounded-xl border transition-all flex items-center justify-center group/shape',
                          selectedObject.type === item.id
                            ? 'bg-indigo-500 text-white border-indigo-400 shadow-lg shadow-indigo-500/20'
                            : 'bg-white/5 border-white/5 text-zinc-600 hover:border-white/10 hover:text-zinc-400'
                        )}
                        title={item.id}
                      >
                        <item.icon className={cn(
                          "w-4 h-4 transition-transform group-hover/shape:scale-110",
                          selectedObject.type === item.id ? "text-white" : "text-zinc-500"
                        )} />
                      </button>
                    ))}
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-500" />
                    MATERIAL_PRESETS
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {materialPresets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => applyPreset(preset)}
                        className="px-3 py-1.5 rounded-xl border border-white/5 bg-white/5 text-[9px] font-mono text-zinc-500 hover:border-indigo-500/30 hover:text-indigo-300 transition-all uppercase tracking-wider"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2.5">
                    <Rotate3d className="w-3.5 h-3.5 text-indigo-500" />
                    ANIMATION_MODE
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['float', 'pulse', 'orbit', 'static'].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => updateSelectedObject({ animationMode: mode as any })}
                        className={cn(
                          'py-2.5 rounded-xl border text-[9px] font-mono transition-all flex items-center justify-center gap-2',
                          selectedObject.animationMode === mode
                            ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-200'
                            : 'bg-white/5 border-white/5 text-zinc-500 hover:border-white/10'
                        )}
                      >
                        <div className={cn(
                          "w-1 h-1 rounded-full",
                          selectedObject.animationMode === mode ? "bg-indigo-400 shadow-[0_0_5px_rgba(129,140,248,0.8)]" : "bg-zinc-800"
                        )} />
                        {mode.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              {/* Material Properties */}
              <div className="bg-zinc-900/20 border border-white/5 rounded-2xl p-6 space-y-6 backdrop-blur-xl">
                <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2.5">
                  <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                  PHYSICAL_PROPERTIES
                </h3>
                
                <div className="space-y-5">
                  {[
                    { label: 'OPACITY', value: selectedObject.opacity, key: 'opacity', min: 0, max: 1 },
                    { label: 'METALNESS', value: selectedObject.metalness, key: 'metalness', min: 0, max: 1 },
                    { label: 'ROUGHNESS', value: selectedObject.roughness, key: 'roughness', min: 0, max: 1 },
                    { label: 'TRANSMISSION', value: selectedObject.transmission, key: 'transmission', min: 0, max: 1 },
                    { label: 'DISTORT', value: selectedObject.distort, key: 'distort', min: 0, max: 1 },
                    { label: 'SPEED', value: selectedObject.speed, key: 'speed', min: 0, max: 10 },
                  ].map((prop) => (
                    <div key={prop.label} className="space-y-2.5">
                      <div className="flex justify-between items-center text-[9px] font-mono">
                        <label className="text-zinc-500 font-bold tracking-widest">{prop.label}</label>
                        <span className="text-indigo-400">{prop.value.toFixed(2)}</span>
                      </div>
                      <div className="relative h-1.5 bg-black/40 rounded-full overflow-hidden group/slider">
                        <input
                          type="range"
                          min={prop.min}
                          max={prop.max}
                          step="0.01"
                          value={prop.value}
                          onChange={(e) => updateSelectedObject({ [prop.key]: parseFloat(e.target.value) })}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div 
                          className="absolute top-0 left-0 h-full bg-indigo-500/40 transition-all group-hover/slider:bg-indigo-500/60"
                          style={{ width: `${((prop.value - prop.min) / (prop.max - prop.min)) * 100}%` }}
                        />
                        <div 
                          className="absolute top-0 h-full w-1 bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)] transition-all"
                          style={{ left: `calc(${((prop.value - prop.min) / (prop.max - prop.min)) * 100}% - 2px)` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Center: Viewport */}
          <div className="col-span-6 relative bg-black rounded-[2.5rem] border border-white/5 overflow-hidden group/viewport shadow-2xl">
            {/* Viewport Overlay */}
            <div className="absolute top-8 left-8 z-20 pointer-events-none flex flex-col gap-4">
              <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                  <Box className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Active_Object</h4>
                  <p className="text-xs font-mono text-white font-bold">{selectedObject.id.toUpperCase()}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl px-3 py-1.5 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">Live_Feed</span>
                </div>
                <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl px-3 py-1.5 flex items-center gap-2">
                  <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">Objects: {sceneObjects.length}/5</span>
                </div>
              </div>
            </div>

            <div className="absolute top-8 right-8 z-20 flex flex-col gap-2 pointer-events-none">
              <div className="px-3 py-1.5 bg-black/60 border border-white/10 rounded-xl text-[9px] font-mono text-zinc-400 backdrop-blur-md flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                FPS: 60.0
              </div>
            </div>

            {/* Grid Helper Decoration */}
            <div className="absolute inset-0 pointer-events-none opacity-5">
              <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>

            {/* The 3D Scene */}
            <div className="absolute inset-0 z-10">
              <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
                <Suspense fallback={<Html center><div className="text-indigo-500 font-mono animate-pulse text-xs tracking-[0.2em]">INITIALIZING_SCENE...</div></Html>}>
                  {sceneObjects.map((obj) => (
                    <AnimatedShape
                      key={obj.id}
                      {...obj}
                      isSelected={selectedObjectId === obj.id}
                      onSelect={() => setSelectedObjectId(obj.id)}
                    />
                  ))}
                  <Environment preset={env} />
                  {env === 'night' && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />}
                  <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <Text
                      position={[0, 2, 0]}
                      fontSize={0.2}
                      color="white"
                      font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
                      anchorX="center"
                      anchorY="middle"
                    >
                      {selectedObject.type.toUpperCase()}
                    </Text>
                  </Float>
                  <Grid 
                    infiniteGrid 
                    fadeDistance={50} 
                    fadeStrength={5} 
                    cellSize={1} 
                    sectionSize={5} 
                    sectionThickness={1.5} 
                    sectionColor="#6366f1" 
                    cellColor="#1f2937" 
                    position={[0, -2, 0]} 
                  />
                  <ContactShadows
                    position={[0, -2, 0]}
                    opacity={0.4}
                    scale={10}
                    blur={2}
                    far={4.5}
                  />
                  <EffectComposer multisampling={8}>
                    <Bloom 
                      intensity={bloomIntensity} 
                      luminanceThreshold={0.1} 
                      luminanceSmoothing={0.9} 
                    />
                    <ChromaticAberration offset={new THREE.Vector2(chromaticAberration, chromaticAberration)} />
                    <Glitch 
                      delay={new THREE.Vector2(1, 4)} 
                      duration={new THREE.Vector2(0.1, 0.3)} 
                      strength={new THREE.Vector2(0.1, 0.3)} 
                      active={glitchIntensity > 0} 
                      ratio={glitchIntensity}
                    />
                    <Scanline opacity={scanlineOpacity} />
                    <Noise opacity={noiseOpacity} />
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                  </EffectComposer>
                </Suspense>
                <OrbitControls
                  makeDefault
                  minPolarAngle={0}
                  maxPolarAngle={Math.PI / 1.75}
                />
              </Canvas>
            </div>

            {/* Bottom Controls Overlay */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              <div className="px-6 py-3 bg-black/80 border border-white/10 rounded-2xl backdrop-blur-xl flex items-center gap-6 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)] animate-pulse" />
                  <span className="text-[10px] font-mono text-zinc-400 font-bold tracking-widest">RENDER_ACTIVE</span>
                </div>
                <div className="h-4 w-px bg-white/10" />
                <div className="flex items-center gap-5">
                  <button className="text-zinc-500 hover:text-indigo-400 transition-all hover:scale-110"><Rotate3d className="w-4 h-4" /></button>
                  <button className="text-zinc-500 hover:text-indigo-400 transition-all hover:scale-110"><Maximize2 className="w-4 h-4" /></button>
                  <button className="text-zinc-500 hover:text-indigo-400 transition-all hover:scale-110"><Eye className="w-4 h-4" /></button>
                  <button className="p-2 rounded-xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-400 transition-all">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Scene & Effects */}
          <aside className="col-span-3 flex flex-col gap-6 overflow-y-auto pl-2 custom-scrollbar">
            {/* Color & Emissive */}
            <div className="bg-zinc-900/20 border border-white/5 rounded-2xl p-6 space-y-7 backdrop-blur-xl">
              <section className="space-y-4">
                <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2.5">
                  <Palette className="w-3.5 h-3.5 text-indigo-500" />
                  COLOR_PALETTE
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {colors.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => handleColorChange(c.hex)}
                      className={cn(
                        'w-full aspect-square rounded-xl border-2 transition-all p-1',
                        selectedObject.color === c.hex ? 'border-indigo-500 shadow-lg shadow-indigo-500/20' : 'border-transparent hover:border-white/10'
                      )}
                    >
                      <div className="w-full h-full rounded-lg shadow-inner" style={{ backgroundColor: c.hex }} />
                    </button>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2.5">
                    <Sun className="w-3.5 h-3.5 text-indigo-500" />
                    EMISSIVE_GLOW
                  </h3>
                  <span className="text-[9px] font-mono text-indigo-400">{selectedObject.emissiveIntensity.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={selectedObject.emissiveIntensity}
                  onChange={(e) => updateSelectedObject({ emissiveIntensity: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                  {['#000000', '#6366f1', '#f43f5e', '#10b981', '#f59e0b'].map((hex) => (
                    <button
                      key={hex}
                      onClick={() => updateSelectedObject({ emissive: hex })}
                      className={cn(
                        'w-8 h-8 rounded-xl border transition-all shrink-0 shadow-lg',
                        selectedObject.emissive === hex ? 'border-white scale-110' : 'border-white/5 hover:border-white/20'
                      )}
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
              </section>
            </div>

            {/* Post Processing */}
            <div className="bg-zinc-900/20 border border-white/5 rounded-2xl p-6 space-y-7 backdrop-blur-xl">
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2.5">
                <Zap className="w-3.5 h-3.5 text-indigo-500" />
                POST_FX_ENGINE
              </h3>
              
              <div className="space-y-5">
                {[
                  { label: 'BLOOM_INTENSITY', value: bloomIntensity, setter: setBloomIntensity, min: 0, max: 5 },
                  { label: 'CHROMATIC_ABERRATION', value: chromaticAberration, setter: setChromaticAberration, min: 0, max: 0.02 },
                  { label: 'GLITCH_STRENGTH', value: glitchIntensity, setter: setGlitchIntensity, min: 0, max: 1 },
                  { label: 'SCANLINE_OPACITY', value: scanlineOpacity, setter: setScanlineOpacity, min: 0, max: 1 },
                  { label: 'NOISE_OPACITY', value: noiseOpacity, setter: setNoiseOpacity, min: 0, max: 0.2 },
                ].map((prop) => (
                  <div key={prop.label} className="space-y-2.5">
                    <div className="flex justify-between items-center text-[9px] font-mono">
                      <label className="text-zinc-500 font-bold tracking-widest">{prop.label}</label>
                      <span className="text-indigo-400">{prop.value.toFixed(3)}</span>
                    </div>
                    <div className="relative h-1.5 bg-black/40 rounded-full overflow-hidden group/slider">
                      <input
                        type="range"
                        min={prop.min}
                        max={prop.max}
                        step={prop.max / 100}
                        value={prop.value}
                        onChange={(e) => prop.setter(parseFloat(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div 
                        className="absolute top-0 left-0 h-full bg-indigo-500/40 transition-all group-hover/slider:bg-indigo-500/60"
                        style={{ width: `${((prop.value - prop.min) / (prop.max - prop.min)) * 100}%` }}
                      />
                      <div 
                        className="absolute top-0 h-full w-1 bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)] transition-all"
                        style={{ left: `calc(${((prop.value - prop.min) / (prop.max - prop.min)) * 100}% - 2px)` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scene Environment */}
            <div className="bg-zinc-900/20 border border-white/5 rounded-2xl p-6 space-y-5 backdrop-blur-xl">
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2.5">
                <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
                WORLD_ENV
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {envs.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => handleEnvChange(e.id)}
                    className={cn(
                      'py-3 rounded-xl border text-[9px] font-mono transition-all uppercase tracking-widest',
                      env === e.id
                        ? 'bg-indigo-500 text-white border-indigo-400 shadow-lg shadow-indigo-500/20'
                        : 'bg-white/5 border-white/5 text-zinc-500 hover:border-white/10'
                    )}
                  >
                    {e.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scene Stats */}
            <div className="bg-zinc-900/20 border border-white/5 rounded-2xl p-6 space-y-5 backdrop-blur-xl">
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                SCENE_STATS
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-[9px] font-mono">
                  <span className="text-zinc-600 font-bold tracking-widest">Objects</span>
                  <span className="text-indigo-400">{sceneObjects.length} ACTIVE</span>
                </div>
                <div className="flex justify-between text-[9px] font-mono">
                  <span className="text-zinc-600 font-bold tracking-widest">Complexity</span>
                  <span className="text-indigo-400">{(sceneObjects.reduce((acc, obj) => acc + obj.miniObjectsCount * 10 + 100, 0)).toLocaleString()} POLY</span>
                </div>
                <div className="flex justify-between text-[9px] font-mono">
                  <span className="text-zinc-600 font-bold tracking-widest">Selected</span>
                  <span className="text-indigo-400 uppercase font-bold">{selectedObject.id}</span>
                </div>
              </div>
            </div>
          </aside>
        </main>

        {/* Footer Status Bar */}
        <footer className="h-10 border-t border-white/5 bg-black/40 backdrop-blur-xl px-6 flex items-center justify-between text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em]">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              <span>System_Ready</span>
            </div>
            <div className="w-px h-3 bg-white/5" />
            <span>Session: ACTIVE_USER</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Objects: {sceneObjects.length}</span>
            <span>Vertices: ~{(sceneObjects.length * 2400).toLocaleString()}</span>
            <div className="w-px h-3 bg-white/5" />
            <span className="text-indigo-500/60 font-bold">Studio_v2.5.0_Stable</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
