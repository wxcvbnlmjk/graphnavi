# Graphnavi

Network analysis and visualization tool: [graphnavi.vercel.app](https://graphnavi.vercel.app/)

![Graphnavi](https://user-images.githubusercontent.com/351828/189877313-dcbc517c-fd31-49c9-b09d-fecffb8724c6.jpg)


https://user-images.githubusercontent.com/351828/188310397-9a14b73f-41ba-47e3-b1df-88fa0b400cd3.mp4



## Rationale
Network analysis tools can be intimidating, and especially, the data preparation in the form that these tools expect (which often involves combining multiple datasets) can be very time consuming.
SQL is a very powerful and quite popuar language for data analysis and manipulation which can be of immense help for the data preparation. However, setting up a database with an SQL query engine is often a tedious process.
Thanks to [DuckDB](https://www.duckdb.org") we can now run an efficient SQL database, execute queries directly in the browser
and pass the results to a graph layout engine to visualize them as a network.



## Roadmap
- Non-expert mode not requiring familiarity with SQL
- Support for more visual attributes: node sizes, colors, edge thickness, color, edge labels
- Saving added datasets and queries to GitHub Gists
- Query history
- Table view for the input files and for the query results (e.g. [one](https://react-data-table-component.netlify.app/?path=/docs/custom-styles-compact-grid--compact-grid) [two](https://react-datasheet-grid.netlify.app/)) [three](https://react-turntable.netlify.app/?path=/docs/introduction--page)
- Pass table schema to the query auto-completion engine
- More efficient data structures (arrow) for the graph/layout to support larger graphs  
- Graph layout taking node/edge weights/importance into account (e.g. [like this one](https://networkofthrones.wordpress.com/)) 
- Consider using other graph rendering approaches: [one](https://observablehq.com/@zakjan/force-directed-graph-pixi), [two](https://bl.ocks.org/BTKY/6c282b65246f8f46bb55aadc322db709), [three](https://observablehq.com/@subbuballa/force-directed-graph)
- Weighted [one](https://observablehq.com/@stefanwenger/game-of-thrones-character-influence), [two](https://observablehq.com/@ericmauviere/graphology-et-migrations-residentielles-entre-aires), [three](https://observablehq.com/@jrladd/gotgraphology), [four](https://observablehq.com/@mef/forceatlas2-layout-settings-visualized)
- Potentially: Try again to integrate [Graphistry.js](https://github.com/graphistry/graphistry-js)

## Development

```bash
npm install
npm run dev
# or
yarn
yarn dev
```

## License

GraphNAVI is free non-commercial usage. If you want to use it in a commercial project, please reach out to ilya@boyandin.me.

<a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/">Creative Commons Attribution-NonCommercial 4.0 International License</a>.
