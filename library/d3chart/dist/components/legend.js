import"core-js/modules/es.array.concat.js";import"core-js/modules/es.array.join.js";import"core-js/modules/web.timers.js";import"core-js/modules/es.object.assign.js";import"core-js/modules/es.array.map.js";import{format,range,interpolateRound,quantile,axisBottom}from"d3";export function createLegend(svg,keys,colorScale,props,onHover,noHover){var I=range(keys.length),legend=svg.append("g").attr("cursor","pointer").attr("transform","translate(".concat(props.base.width-props.margin.right+30,", ").concat(props.margin.top,")"));return legend.selectAll("circle").data(I).join("circle").attr("class","svg-legend").attr("cx",0).attr("cy",function(_,i){return 1.1*(20*i)}).attr("r",10).attr("fill",function(i){return colorScale(keys[i])}),legend.selectAll("text").data(I).join("text").attr("class","svg-legend").attr("x",20).attr("y",function(_,i){return 1.1*(20*i)+4}).attr("text-anchor","start").style("fill","currentColor").style("font-size","12px").style("font-weight",300).text(function(i){return keys[i]}),setTimeout(function(){legend.selectAll(".svg-legend").on("mouseover",onHover).on("mouseleave",noHover)},props.animation.duration+1),legend}export function createSequentialLegend(svg,colorScale,props){var legendX=Object.assign(colorScale.copy().interpolator(interpolateRound(0,200)),{range:function(){return[0,200]}}),Legend=svg.append("g").attr("transform","translate(10, ".concat(props.margin.top/3,")"));Legend.append("image").attr("x",0).attr("y",0).attr("width",200).attr("height",10).attr("preserveAspectRatio","none").attr("xlink:href",function(){var canvasElement=ramp(colorScale.interpolator());return void 0===canvasElement?null:canvasElement.toDataURL()});var ticks=props.base.width/250,n=Math.round(ticks+1),tickValues=range(n).map(function(i){return quantile(colorScale.domain(),i/(n-1))}),tickFormat=format(props.heatmap.formatTick===void 0?",.0f":props.heatmap.formatTick);Legend.append("g").attr("transform","translate(0, 10)").call(axisBottom(legendX).ticks(ticks,props.heatmap.formatTick).tickFormat(tickFormat).tickSize(6).tickValues(tickValues)).call(function(g){return g.selectAll(".tick line").attr("y1",-10)}).call(function(g){return g.select(".domain").remove()}).call(function(g){return g.append("text").attr("x",0).attr("y",-16).attr("fill","currentColor").attr("text-anchor","start").attr("font-weight","bold").text(props.legend.title)})}function ramp(color){var n=1<arguments.length&&arguments[1]!==void 0?arguments[1]:256,canvas=document.createElement("canvas");canvas.width=n,canvas.height=1;var context=canvas.getContext("2d",{willReadFrequently:!0});if(null!==context){for(var i=0;i<n;i++)context.fillStyle=color(i/(n-1)),context.fillRect(i,0,1,1);return canvas}}