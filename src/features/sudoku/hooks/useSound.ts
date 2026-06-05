import { useCallback, useRef } from 'react';

export function useSound(src: string, volume = 1) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);

  // carrega o arquivo uma vez
  const load = useCallback(async () => {
    if (bufferRef.current) return;
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;
    const response = await fetch(src);
    const arrayBuffer = await response.arrayBuffer();
    bufferRef.current = await ctx.decodeAudioData(arrayBuffer);
  }, [src]);

  const play = useCallback(async (pitch = 1) => {
    await load();
    const ctx = audioCtxRef.current!;
    const buffer = bufferRef.current!;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = pitch; // 1.0 = normal, 2.0 = dobro do pitch

    const gainNode = ctx.createGain();
    gainNode.gain.value = volume;

    source.connect(gainNode);
    gainNode.connect(ctx.destination);
    source.start();
  }, [load, volume]);

  return play;
}