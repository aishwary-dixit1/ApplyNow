// basic request body sanitization to remove keys starting with $ or containing .
function sanitize(req, res, next){
  const scrub = (obj) => {
    if(!obj || typeof obj !== 'object') return obj
    if(Array.isArray(obj)) return obj.map(scrub)
    const clean = {}
    for(const key of Object.keys(obj)){
      if(key.includes('.') || key.startsWith('$')) continue
      const val = obj[key]
      clean[key] = (typeof val === 'object') ? scrub(val) : val
    }
    return clean
  }
  req.body = scrub(req.body)
  next()
}

module.exports = sanitize
