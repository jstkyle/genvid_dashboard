import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js"; // Assuming Hls.js is properly installed and has type definitions.

const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const intervalRef = useRef<number | null>(null);
  const [hlsInstance, setHlsInstance] = useState<Hls | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playlistContent, setPlaylistContent] = useState("");
  const [playlistUrl, setPlaylistUrl] = useState(
    "/api/stream-video?video=playlist.m3u8"
  );

  // Array of input URLs
  const inputUrls = [
    "https://clips-queue.s3.ap-northeast-1.amazonaws.com/videos/clip1.mp4?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLW5vcnRoZWFzdC0yIkgwRgIhAKfMOC7X%2BOM%2FNNDjp7of%2B7yEa5egL68yLtgTiFnIuMziAiEA2FrbQIpnfDgmXxrB8hFdrIe9auDostUrfffeTqHEaK4qywMIGBAAGgw1NDY3MjQxOTI3NTgiDAnwM6ynITPLjZfDzCqoA69tVjkgpH2JrxXal6K5TM%2F8noxjaL5uFC2JLTTE%2FqIaOxDdJmZLZg6WriJd%2F9VibRdFJ5Zk6kENod3gsLClPLxkY%2BkABbYeyy61FsmdNRRiH6%2BYF0bwoL1OalshyJW4RlQLmFydkqoTTOph2vFJlkrHYlu7ktSoGcdCWfDFJQB2uSnmuPsDRGTElbuMOV1duhT1z90FX1MyEig%2B4u%2FeodRidgWeOVx8407XqniaDOD6nHoGY40oClhNt8%2FNHO4d9wk108EGYjS2E98NZ9bkCnuqkiGMFIt0dfxNqTQbRwUk9gWnM8alnJMrSNxyV6vMWqK94njcvfUwa%2BNHPSzhtYbcRdwMj0czXLPnzdGIFYJ7V%2Fkk7KYgfH5eOA%2BoOVSYMtCbvEFZ2%2BOiXm9y3dx4pIzR%2FwacMbE%2Ffpv9PdG7o6njSGtwVstBnZ74L0kzlZYWmAJm8U2JyPJqjJy5gsbhrhObrIUgg6MmJ7R8tCr4GNOEVKFlA0EhyobNlDM31wwKZLixUjVGmQiuWNyAXTyDAIh3uxYrwHF1vYhJtS4YFo3MUGbMMjIQ%2FnYwn6C%2BqgY6kwKW3Tr1FzP6z0hdLgJJuO3V6T06ORzdM5KnZB6PzHkF2GYXoLLI9dsm2eihx%2F62doKsw07Gt8BtiRGHCRbYjsRS7mH%2BQ9Gam4FucgdenkFYNBOUqHoar62ds6oimcdE0sVQr%2F7DTrWDe%2Fb%2B3tvwvKAo793%2BH6NRjxUqoo4cYiLbyVK%2BGmwJg8VjnaI0LMeu09SPBPcWt2Hg%2BYrQNtBFqIJ%2BhqQkanVQqXgiXGH1NQYsR8EJMsYjOLEhCrzGkGtIMygCeZAAbkfI60qhrMhgy%2BqAasY599%2Bu%2Fj%2FfAdy%2Fe9jVwdas7Zj7YqlYokMLtn5fzkXK1W8nB%2FKR6WJf90BWcuZiGLFatYXx3HBf6eVOPh8OuJp8zA%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20231111T143138Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIAX6S2NEH3I4QSFUHU%2F20231111%2Fap-northeast-1%2Fs3%2Faws4_request&X-Amz-Signature=ce2fbbd065c89f3c7a66183f6d98be3a96710e8b71159963f4e3ca0904940257",
    "https://clips-queue.s3.ap-northeast-1.amazonaws.com/videos/clip2.mp4?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLW5vcnRoZWFzdC0yIkgwRgIhAKfMOC7X%2BOM%2FNNDjp7of%2B7yEa5egL68yLtgTiFnIuMziAiEA2FrbQIpnfDgmXxrB8hFdrIe9auDostUrfffeTqHEaK4qywMIGBAAGgw1NDY3MjQxOTI3NTgiDAnwM6ynITPLjZfDzCqoA69tVjkgpH2JrxXal6K5TM%2F8noxjaL5uFC2JLTTE%2FqIaOxDdJmZLZg6WriJd%2F9VibRdFJ5Zk6kENod3gsLClPLxkY%2BkABbYeyy61FsmdNRRiH6%2BYF0bwoL1OalshyJW4RlQLmFydkqoTTOph2vFJlkrHYlu7ktSoGcdCWfDFJQB2uSnmuPsDRGTElbuMOV1duhT1z90FX1MyEig%2B4u%2FeodRidgWeOVx8407XqniaDOD6nHoGY40oClhNt8%2FNHO4d9wk108EGYjS2E98NZ9bkCnuqkiGMFIt0dfxNqTQbRwUk9gWnM8alnJMrSNxyV6vMWqK94njcvfUwa%2BNHPSzhtYbcRdwMj0czXLPnzdGIFYJ7V%2Fkk7KYgfH5eOA%2BoOVSYMtCbvEFZ2%2BOiXm9y3dx4pIzR%2FwacMbE%2Ffpv9PdG7o6njSGtwVstBnZ74L0kzlZYWmAJm8U2JyPJqjJy5gsbhrhObrIUgg6MmJ7R8tCr4GNOEVKFlA0EhyobNlDM31wwKZLixUjVGmQiuWNyAXTyDAIh3uxYrwHF1vYhJtS4YFo3MUGbMMjIQ%2FnYwn6C%2BqgY6kwKW3Tr1FzP6z0hdLgJJuO3V6T06ORzdM5KnZB6PzHkF2GYXoLLI9dsm2eihx%2F62doKsw07Gt8BtiRGHCRbYjsRS7mH%2BQ9Gam4FucgdenkFYNBOUqHoar62ds6oimcdE0sVQr%2F7DTrWDe%2Fb%2B3tvwvKAo793%2BH6NRjxUqoo4cYiLbyVK%2BGmwJg8VjnaI0LMeu09SPBPcWt2Hg%2BYrQNtBFqIJ%2BhqQkanVQqXgiXGH1NQYsR8EJMsYjOLEhCrzGkGtIMygCeZAAbkfI60qhrMhgy%2BqAasY599%2Bu%2Fj%2FfAdy%2Fe9jVwdas7Zj7YqlYokMLtn5fzkXK1W8nB%2FKR6WJf90BWcuZiGLFatYXx3HBf6eVOPh8OuJp8zA%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20231111T143518Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIAX6S2NEH3I4QSFUHU%2F20231111%2Fap-northeast-1%2Fs3%2Faws4_request&X-Amz-Signature=b148832260710fa4bf49db1d7968a4d1c075e062640400a3fde528d6392a4fe2",
    "https://clips-queue.s3.ap-northeast-1.amazonaws.com/videos/clip3.mp4?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLW5vcnRoZWFzdC0yIkgwRgIhAKfMOC7X%2BOM%2FNNDjp7of%2B7yEa5egL68yLtgTiFnIuMziAiEA2FrbQIpnfDgmXxrB8hFdrIe9auDostUrfffeTqHEaK4qywMIGBAAGgw1NDY3MjQxOTI3NTgiDAnwM6ynITPLjZfDzCqoA69tVjkgpH2JrxXal6K5TM%2F8noxjaL5uFC2JLTTE%2FqIaOxDdJmZLZg6WriJd%2F9VibRdFJ5Zk6kENod3gsLClPLxkY%2BkABbYeyy61FsmdNRRiH6%2BYF0bwoL1OalshyJW4RlQLmFydkqoTTOph2vFJlkrHYlu7ktSoGcdCWfDFJQB2uSnmuPsDRGTElbuMOV1duhT1z90FX1MyEig%2B4u%2FeodRidgWeOVx8407XqniaDOD6nHoGY40oClhNt8%2FNHO4d9wk108EGYjS2E98NZ9bkCnuqkiGMFIt0dfxNqTQbRwUk9gWnM8alnJMrSNxyV6vMWqK94njcvfUwa%2BNHPSzhtYbcRdwMj0czXLPnzdGIFYJ7V%2Fkk7KYgfH5eOA%2BoOVSYMtCbvEFZ2%2BOiXm9y3dx4pIzR%2FwacMbE%2Ffpv9PdG7o6njSGtwVstBnZ74L0kzlZYWmAJm8U2JyPJqjJy5gsbhrhObrIUgg6MmJ7R8tCr4GNOEVKFlA0EhyobNlDM31wwKZLixUjVGmQiuWNyAXTyDAIh3uxYrwHF1vYhJtS4YFo3MUGbMMjIQ%2FnYwn6C%2BqgY6kwKW3Tr1FzP6z0hdLgJJuO3V6T06ORzdM5KnZB6PzHkF2GYXoLLI9dsm2eihx%2F62doKsw07Gt8BtiRGHCRbYjsRS7mH%2BQ9Gam4FucgdenkFYNBOUqHoar62ds6oimcdE0sVQr%2F7DTrWDe%2Fb%2B3tvwvKAo793%2BH6NRjxUqoo4cYiLbyVK%2BGmwJg8VjnaI0LMeu09SPBPcWt2Hg%2BYrQNtBFqIJ%2BhqQkanVQqXgiXGH1NQYsR8EJMsYjOLEhCrzGkGtIMygCeZAAbkfI60qhrMhgy%2BqAasY599%2Bu%2Fj%2FfAdy%2Fe9jVwdas7Zj7YqlYokMLtn5fzkXK1W8nB%2FKR6WJf90BWcuZiGLFatYXx3HBf6eVOPh8OuJp8zA%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20231111T143536Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIAX6S2NEH3I4QSFUHU%2F20231111%2Fap-northeast-1%2Fs3%2Faws4_request&X-Amz-Signature=45a9c365276f1984d9af58584aee9f2fd8076e70d302188f88c7624b8ea498f3",
    "https://clips-queue.s3.ap-northeast-1.amazonaws.com/videos/clip4.mp4?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLW5vcnRoZWFzdC0yIkgwRgIhAKfMOC7X%2BOM%2FNNDjp7of%2B7yEa5egL68yLtgTiFnIuMziAiEA2FrbQIpnfDgmXxrB8hFdrIe9auDostUrfffeTqHEaK4qywMIGBAAGgw1NDY3MjQxOTI3NTgiDAnwM6ynITPLjZfDzCqoA69tVjkgpH2JrxXal6K5TM%2F8noxjaL5uFC2JLTTE%2FqIaOxDdJmZLZg6WriJd%2F9VibRdFJ5Zk6kENod3gsLClPLxkY%2BkABbYeyy61FsmdNRRiH6%2BYF0bwoL1OalshyJW4RlQLmFydkqoTTOph2vFJlkrHYlu7ktSoGcdCWfDFJQB2uSnmuPsDRGTElbuMOV1duhT1z90FX1MyEig%2B4u%2FeodRidgWeOVx8407XqniaDOD6nHoGY40oClhNt8%2FNHO4d9wk108EGYjS2E98NZ9bkCnuqkiGMFIt0dfxNqTQbRwUk9gWnM8alnJMrSNxyV6vMWqK94njcvfUwa%2BNHPSzhtYbcRdwMj0czXLPnzdGIFYJ7V%2Fkk7KYgfH5eOA%2BoOVSYMtCbvEFZ2%2BOiXm9y3dx4pIzR%2FwacMbE%2Ffpv9PdG7o6njSGtwVstBnZ74L0kzlZYWmAJm8U2JyPJqjJy5gsbhrhObrIUgg6MmJ7R8tCr4GNOEVKFlA0EhyobNlDM31wwKZLixUjVGmQiuWNyAXTyDAIh3uxYrwHF1vYhJtS4YFo3MUGbMMjIQ%2FnYwn6C%2BqgY6kwKW3Tr1FzP6z0hdLgJJuO3V6T06ORzdM5KnZB6PzHkF2GYXoLLI9dsm2eihx%2F62doKsw07Gt8BtiRGHCRbYjsRS7mH%2BQ9Gam4FucgdenkFYNBOUqHoar62ds6oimcdE0sVQr%2F7DTrWDe%2Fb%2B3tvwvKAo793%2BH6NRjxUqoo4cYiLbyVK%2BGmwJg8VjnaI0LMeu09SPBPcWt2Hg%2BYrQNtBFqIJ%2BhqQkanVQqXgiXGH1NQYsR8EJMsYjOLEhCrzGkGtIMygCeZAAbkfI60qhrMhgy%2BqAasY599%2Bu%2Fj%2FfAdy%2Fe9jVwdas7Zj7YqlYokMLtn5fzkXK1W8nB%2FKR6WJf90BWcuZiGLFatYXx3HBf6eVOPh8OuJp8zA%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20231111T143616Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIAX6S2NEH3I4QSFUHU%2F20231111%2Fap-northeast-1%2Fs3%2Faws4_request&X-Amz-Signature=55c7084b859a5d7a3a330751e91ecd10b806c2e1d765c5341ae30eea463a9220",
    "https://clips-queue.s3.ap-northeast-1.amazonaws.com/videos/clip5.mp4?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLW5vcnRoZWFzdC0yIkgwRgIhAKfMOC7X%2BOM%2FNNDjp7of%2B7yEa5egL68yLtgTiFnIuMziAiEA2FrbQIpnfDgmXxrB8hFdrIe9auDostUrfffeTqHEaK4qywMIGBAAGgw1NDY3MjQxOTI3NTgiDAnwM6ynITPLjZfDzCqoA69tVjkgpH2JrxXal6K5TM%2F8noxjaL5uFC2JLTTE%2FqIaOxDdJmZLZg6WriJd%2F9VibRdFJ5Zk6kENod3gsLClPLxkY%2BkABbYeyy61FsmdNRRiH6%2BYF0bwoL1OalshyJW4RlQLmFydkqoTTOph2vFJlkrHYlu7ktSoGcdCWfDFJQB2uSnmuPsDRGTElbuMOV1duhT1z90FX1MyEig%2B4u%2FeodRidgWeOVx8407XqniaDOD6nHoGY40oClhNt8%2FNHO4d9wk108EGYjS2E98NZ9bkCnuqkiGMFIt0dfxNqTQbRwUk9gWnM8alnJMrSNxyV6vMWqK94njcvfUwa%2BNHPSzhtYbcRdwMj0czXLPnzdGIFYJ7V%2Fkk7KYgfH5eOA%2BoOVSYMtCbvEFZ2%2BOiXm9y3dx4pIzR%2FwacMbE%2Ffpv9PdG7o6njSGtwVstBnZ74L0kzlZYWmAJm8U2JyPJqjJy5gsbhrhObrIUgg6MmJ7R8tCr4GNOEVKFlA0EhyobNlDM31wwKZLixUjVGmQiuWNyAXTyDAIh3uxYrwHF1vYhJtS4YFo3MUGbMMjIQ%2FnYwn6C%2BqgY6kwKW3Tr1FzP6z0hdLgJJuO3V6T06ORzdM5KnZB6PzHkF2GYXoLLI9dsm2eihx%2F62doKsw07Gt8BtiRGHCRbYjsRS7mH%2BQ9Gam4FucgdenkFYNBOUqHoar62ds6oimcdE0sVQr%2F7DTrWDe%2Fb%2B3tvwvKAo793%2BH6NRjxUqoo4cYiLbyVK%2BGmwJg8VjnaI0LMeu09SPBPcWt2Hg%2BYrQNtBFqIJ%2BhqQkanVQqXgiXGH1NQYsR8EJMsYjOLEhCrzGkGtIMygCeZAAbkfI60qhrMhgy%2BqAasY599%2Bu%2Fj%2FfAdy%2Fe9jVwdas7Zj7YqlYokMLtn5fzkXK1W8nB%2FKR6WJf90BWcuZiGLFatYXx3HBf6eVOPh8OuJp8zA%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20231111T143639Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIAX6S2NEH3I4QSFUHU%2F20231111%2Fap-northeast-1%2Fs3%2Faws4_request&X-Amz-Signature=eaf54b632a85dfe1f93c4e56c67b46e316301c9950dddd114ff412cc0135ac2c",
    "https://clips-queue.s3.ap-northeast-1.amazonaws.com/videos/clip6.mp4?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLW5vcnRoZWFzdC0yIkgwRgIhAKfMOC7X%2BOM%2FNNDjp7of%2B7yEa5egL68yLtgTiFnIuMziAiEA2FrbQIpnfDgmXxrB8hFdrIe9auDostUrfffeTqHEaK4qywMIGBAAGgw1NDY3MjQxOTI3NTgiDAnwM6ynITPLjZfDzCqoA69tVjkgpH2JrxXal6K5TM%2F8noxjaL5uFC2JLTTE%2FqIaOxDdJmZLZg6WriJd%2F9VibRdFJ5Zk6kENod3gsLClPLxkY%2BkABbYeyy61FsmdNRRiH6%2BYF0bwoL1OalshyJW4RlQLmFydkqoTTOph2vFJlkrHYlu7ktSoGcdCWfDFJQB2uSnmuPsDRGTElbuMOV1duhT1z90FX1MyEig%2B4u%2FeodRidgWeOVx8407XqniaDOD6nHoGY40oClhNt8%2FNHO4d9wk108EGYjS2E98NZ9bkCnuqkiGMFIt0dfxNqTQbRwUk9gWnM8alnJMrSNxyV6vMWqK94njcvfUwa%2BNHPSzhtYbcRdwMj0czXLPnzdGIFYJ7V%2Fkk7KYgfH5eOA%2BoOVSYMtCbvEFZ2%2BOiXm9y3dx4pIzR%2FwacMbE%2Ffpv9PdG7o6njSGtwVstBnZ74L0kzlZYWmAJm8U2JyPJqjJy5gsbhrhObrIUgg6MmJ7R8tCr4GNOEVKFlA0EhyobNlDM31wwKZLixUjVGmQiuWNyAXTyDAIh3uxYrwHF1vYhJtS4YFo3MUGbMMjIQ%2FnYwn6C%2BqgY6kwKW3Tr1FzP6z0hdLgJJuO3V6T06ORzdM5KnZB6PzHkF2GYXoLLI9dsm2eihx%2F62doKsw07Gt8BtiRGHCRbYjsRS7mH%2BQ9Gam4FucgdenkFYNBOUqHoar62ds6oimcdE0sVQr%2F7DTrWDe%2Fb%2B3tvwvKAo793%2BH6NRjxUqoo4cYiLbyVK%2BGmwJg8VjnaI0LMeu09SPBPcWt2Hg%2BYrQNtBFqIJ%2BhqQkanVQqXgiXGH1NQYsR8EJMsYjOLEhCrzGkGtIMygCeZAAbkfI60qhrMhgy%2BqAasY599%2Bu%2Fj%2FfAdy%2Fe9jVwdas7Zj7YqlYokMLtn5fzkXK1W8nB%2FKR6WJf90BWcuZiGLFatYXx3HBf6eVOPh8OuJp8zA%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20231111T143657Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIAX6S2NEH3I4QSFUHU%2F20231111%2Fap-northeast-1%2Fs3%2Faws4_request&X-Amz-Signature=2a1c85d9917f6b4fc7012632df1d2e9acf0303b38eb3ee5ad1054750e23a7f48",
  ]; // Replace with actual URLs
  const videoKeys = ["playlist.m3u8"];

  const loadPlaylist = async (url) => {
    const videoElement = videoRef.current;
    if (videoElement && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(videoElement);
      setHlsInstance(hls);
    }
  };

  const fetchPlaylist = async () => {
    try {
      const response = await fetch("/api/stream-video?video=playlist.m3u8");
      const data = await response.json();
      if (data.url) {
        loadPlaylist(data.url);
      }
    } catch (error) {
      console.error("Failed to fetch playlist:", error);
    }
  };

  const handleAddBufferClick = async () => {
    if (currentIndex < inputUrls.length) {
      try {
        const response = await fetch("/api/addClip", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: inputUrls[currentIndex] }),
        });
        const data = await response.json();
        console.log("Clip added:", data);
        setCurrentIndex(currentIndex + 1);
      } catch (error) {
        console.error("Error adding clip:", error);
      }
    } else {
      console.log("No more URLs to process");
    }
  };

  useEffect(() => {
    fetchPlaylist();
    const intervalId = setInterval(fetchPlaylist, 20000); // Check for new playlist every 5 seconds

    return () => {
      // clearInterval(intervalId);
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay controls style={{ width: "100%" }} />
      <button onClick={handleAddBufferClick}>Add Clip</button>
    </div>
  );
};

export default VideoPlayer;
