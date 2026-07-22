import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

/* Single registration point. Only import gsap from here (never from "gsap"
   directly) so plugins are registered exactly once, on the client. Consume
   from 'use client' leaf components inside useGSAP(() => {…}, { scope }). */
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
