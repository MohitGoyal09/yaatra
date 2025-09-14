import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // Set up Server-Sent Events headers
  const headers = new Headers({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Cache-Control",
  });

  // Create a readable stream for SSE
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const initialMessage = `data: ${JSON.stringify({
        type: "connection",
        message: "Connected to Live Karma Map",
      })}\n\n`;
      controller.enqueue(new TextEncoder().encode(initialMessage));

      // Simulate real-time karma events
      const sendKarmaEvent = () => {
        // Generate random coordinates around Ujjain (23.1793, 75.7873)
        const lat = 23.1793 + (Math.random() - 0.5) * 0.01; // ±0.005 degrees
        const lng = 75.7873 + (Math.random() - 0.5) * 0.01; // ±0.005 degrees
        const intensity = Math.random() * 100; // Random intensity 0-100

        const karmaEvent = {
          id: `karma-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          lat: parseFloat(lat.toFixed(6)),
          lng: parseFloat(lng.toFixed(6)),
          intensity: Math.round(intensity),
          timestamp: new Date().toISOString(),
          action: getRandomKarmaAction(),
        };

        const message = `data: ${JSON.stringify(karmaEvent)}\n\n`;
        controller.enqueue(new TextEncoder().encode(message));
      };

      // Send karma events every 2-5 seconds
      const interval = setInterval(() => {
        sendKarmaEvent();
      }, Math.random() * 3000 + 2000); // Random interval between 2-5 seconds

      // Cleanup function
      const cleanup = () => {
        clearInterval(interval);
        controller.close();
      };

      // Handle client disconnect
      request.signal.addEventListener("abort", cleanup);
    },
  });

  return new Response(stream, { headers });
}

// Helper function to generate random karma actions
function getRandomKarmaAction(): string {
  const actions = [
    "Helped someone carry groceries",
    "Donated to charity",
    "Volunteered at community center",
    "Helped elderly cross the street",
    "Cleaned up litter",
    "Shared food with homeless",
    "Helped lost tourist",
    "Donated blood",
    "Planting trees",
    "Teaching children",
    "Helping at food bank",
    "Community service",
    "Environmental cleanup",
    "Supporting local business",
    "Helping neighbor with chores",
  ];

  return actions[Math.floor(Math.random() * actions.length)];
}
