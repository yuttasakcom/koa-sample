// import tracer from './tracer'
// import { Tags, FORMAT_HTTP_HEADERS } from 'opentracing'

// export default () => async (ctx, next) => {
//   const parentSpanContext = tracer.extract(FORMAT_HTTP_HEADERS, ctx.header)
//   ctx.req.span = tracer.startSpan(`${ctx.method}: ${ctx.path}`, {
//     childOf: parentSpanContext
//   })
//   ctx.res.on('finish', () => {
//     ctx.req.span.setTag(Tags.HTTP_STATUS_CODE, ctx.status)
//     ctx.req.span.setTag(Tags.ERROR, ctx.status >= 500)
//     ctx.req.span.finish()
//   })
//   await next()
// }

import tracer from './tracer'
import { Tags, FORMAT_HTTP_HEADERS } from 'opentracing'

export default () => async (ctx, next) => {
  const parentSpanContext = tracer.extract(FORMAT_HTTP_HEADERS, ctx.header)
  ctx.req.span = tracer.startSpan(`${ctx.method}: ${ctx.path}`, {
    childOf: parentSpanContext
  })
  ctx.res.on('finish', () => {
    ctx.req.span.setTag(Tags.HTTP_STATUS_CODE, ctx.status)
    // check HTTP status code
    ctx.req.span.setTag(Tags.ERROR, ctx.status >= 500)
    // close the span
    ctx.req.span.finish()
  })
  // console.log(ctx.req, '---end');
  await next()
}
