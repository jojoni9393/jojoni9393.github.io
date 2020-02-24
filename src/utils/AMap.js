export default function MapLoader() {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve(window.AMap)
    } else {
      var script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = true
      script.src =
        'https://webapi.amap.com/maps?v=1.4.15&key=1b2d9a3af752f0d41ff596557d8ce55e&plugin=AMap.Geocoder&callback=initAMap'
      script.onerror = reject
      document.head.appendChild(script)
    }
    window.initAMap = () => {
      resolve(window.AMap)
    }
    console.log(123)
  })
}
