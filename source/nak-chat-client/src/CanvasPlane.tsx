import { Component, onMount } from 'solid-js';
import './App.module.css';


type PlaneConfigProps = {
   pixelSize: number;
   canvasSize: number;
}
const CanvasPlane: Component<PlaneConfigProps> = (props) => {
   const pixelSize = props.pixelSize;
   const canvasSize = props.canvasSize;

   const defaultColor = "#FF0000";
   let canvasRef!: HTMLCanvasElement;

   let cameraOffset = { x: window.innerWidth/2, y: window.innerHeight/2 }
   let cameraZoom = 1
   let MAX_ZOOM = 5
   let MIN_ZOOM = 0.1
   let SCROLL_SENSITIVITY = 0.0005
   let lastZoom = cameraZoom

  onMount(async () => {
   canvasRef.addEventListener('mousedown', onPointerDown)
   canvasRef.addEventListener('mouseup', onPointerUp)
   canvasRef.addEventListener('mousemove', onPointerMove)
   canvasRef.addEventListener( 'wheel', (e) => adjustZoom(e.deltaY*SCROLL_SENSITIVITY))
   draw();
  });

  function draw() {
   const ctx = canvasRef.getContext("2d");
   ctx!.canvas.width  = window.innerWidth;
   ctx!.canvas.height = window.innerHeight;
   ctx!.translate( window.innerWidth / 2, window.innerHeight / 2 )
   ctx!.scale(cameraZoom, cameraZoom)
   ctx!.translate( -window.innerWidth / 2 + cameraOffset.x, -window.innerHeight / 2 + cameraOffset.y )
   ctx!.clearRect(0,0, window.innerWidth, window.innerHeight)
   drawBoard(ctx!);
   requestAnimationFrame( draw )
  }
  function drawBoard(ctx: CanvasRenderingContext2D) {
   for(let y = 0; y < canvasSize; y++)
   {
      for (let x = 0; x < canvasSize; x++)
      {
         let xPos = x * pixelSize;
         let yPos = y * pixelSize;
         ctx.fillStyle = defaultColor;
         ctx.fillRect(xPos, yPos, 5, 5);
      }
   }
  }
   function getEventLocation(e: any) {
      if (e.touches && e.touches.length == 1)
      {
         return { x:e.touches[0].clientX, y: e.touches[0].clientY }
      }
      else if (e.clientX && e.clientY)
      {
         return { x: e.clientX, y: e.clientY }        
      }
   }
   let isDragging = false
   let dragStart = { x: 0, y: 0 }

   function onPointerDown(e: any)
   {
      isDragging = true
      dragStart.x = getEventLocation(e)?.x/cameraZoom - cameraOffset.x
      dragStart.y = getEventLocation(e)?.y/cameraZoom - cameraOffset.y
   }

   function onPointerUp(e: any)
   {
      isDragging = false;
      lastZoom = cameraZoom;
   }

   function onPointerMove(e: any)
   {
      if (isDragging)
      {
         cameraOffset.x = getEventLocation(e)?.x/cameraZoom - dragStart.x
         cameraOffset.y = getEventLocation(e)?.y/cameraZoom - dragStart.y
      }
   }


   function adjustZoom(zoomAmount?: number, zoomFactor?: number)
   {
      if (!isDragging)
      {
         if (zoomAmount)
         {
               cameraZoom += zoomAmount
         }
         else if (zoomFactor)
         {
               console.log(zoomFactor)
               cameraZoom = zoomFactor*lastZoom
         }
         
         cameraZoom = Math.min( cameraZoom, MAX_ZOOM )
         cameraZoom = Math.max( cameraZoom, MIN_ZOOM )
         
         console.log(zoomAmount)
      }
   }

  return (
      <canvas ref={canvasRef}></canvas>
  );
};

export default CanvasPlane;