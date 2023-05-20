import { Component, onMount } from 'solid-js';
import { Application, Graphics } from 'pixi.js';
import { Viewport } from "pixi-viewport";
import './App.module.css';

type PlaneConfigProps = {
   pixelSize: number;
   canvasSize: number;
}

const WebGLCanvasPlane: Component<PlaneConfigProps> = (props) => {
   const pixelSize = props.pixelSize;
   const canvasSize = props.canvasSize;

   const defaultColor = 0xFFFFFF;
   let canvasRef!: HTMLCanvasElement;
   
    
   

  onMount(async () => {
   const app = new Application<HTMLCanvasElement>({
      view: canvasRef,
      width: window.innerWidth,
      height: window.innerHeight,
      antialias: true,
      autoDensity: true,
      backgroundColor: 0x0,
      resolution: devicePixelRatio
    });
    
   const viewport = new Viewport({
      worldWidth: 1000,
      worldHeight: 1000,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      events: app.renderer.events
   })
   .drag()
   .pinch({ percent: 2 })
   .wheel()
   .decelerate();
   app.stage.addChild(viewport);
   app.ticker.start();
   
   const onResize = () => {
      app.renderer.resize(window.innerWidth, window.innerHeight);
      viewport.resize(window.innerWidth, window.innerHeight);
   };
   window.addEventListener("resize", onResize);
   const graphics = drawBoard(viewport);
  });

  function drawBoard(viewport: Viewport) {
     const nextPixel = pixelSize + 1;
     for(let y = 0; y < canvasSize; y++)
     {
        let yPos = y * nextPixel;
        for (let x = 0; x < canvasSize; x++)
        {
         var graphics = new Graphics();
         let xPos = x * nextPixel;
         graphics.beginFill(defaultColor);
         const rect = graphics.drawRect(xPos, yPos, pixelSize, pixelSize);
         rect.interactive = true;
         rect.cursor = 'pointer';
         rect.on('pointerdown', (event) => {
            rect.scale.x *= 1.25;
            rect.scale.y *= 1.25;
         });
         // rect.on('pointerup', () => {
         //    rect.scale.x *= 0.75;
         //    rect.scale.y *= 0.75;
         // })
         viewport.addChild(rect);
      }
   }
  }

  return (
      <canvas ref={canvasRef}></canvas>
  );
};

export default WebGLCanvasPlane;



