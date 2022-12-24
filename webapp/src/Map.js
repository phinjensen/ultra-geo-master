import "./Map.css";

import { useState, useEffect, useCallback } from "react";
import svgPanZoom from "svg-pan-zoom";

export default function Map({ continent, full = false }) {
  const [svg, setSvg] = useState(null);

  const svgRef = useCallback((node) => setSvg(node), []);

  useEffect(() => {
    if (!svg) return;

    const setupInteraction = (doc) => {
      const countries = doc.querySelectorAll(`g[id^="${continent}: "]`);
      for (let group of countries) {
        const name = group.id
          .replace(`${continent}: `, "")
          .replace(/ \(.*\)/, "");
        const country = doc.querySelector(`g[id="${continent}: ${name}"]`);
        group.style.cursor = "pointer";
        group.onmouseover = () => {
          country.setAttributeNS(null, "opacity", "0.8");
        };
        group.onmouseout = () => {
          country.setAttributeNS(null, "opacity", "1");
        };
        group.onclick = () => {
          console.log(name);
        };
      }
    };

    if (svg.contentDocument) {
    } else {
      svg.onload = (event) => {
        setupInteraction(event.target.contentDocument);
        const panZoom = svgPanZoom("#" + continent, {
          zoomEnabled: true,
          controlIconsEnabled: true,
          zoomScaleSensitivity: 0.5,
          fit: true,
        });
        const resizeObserver = new ResizeObserver(() => {
          panZoom.resize();
          panZoom.fit();
          panZoom.center();
        });
        resizeObserver.observe(svg);
      };
    }
  }, [svg]);

  return (
    <div className={`frame full`}>
      <object
        id={continent}
        className="map"
        data={`/${continent}.svg`}
        type="image/svg+xml"
        ref={setSvg}
      />
    </div>
  );
}
