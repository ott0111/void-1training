function time(){
 return new Date().toISOString()
}

const logger={
 info:(...msg)=>console.log(`[${time()}]`,...msg),
 warn:(...msg)=>console.warn(`[${time()}]`,...msg),
 error:(...msg)=>console.error(`[${time()}]`,...msg)
}

module.exports={logger}
