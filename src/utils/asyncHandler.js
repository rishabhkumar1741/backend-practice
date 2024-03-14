const asyncHandler = (requestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=> next(err))
    }
}


  

// const asyncHandler = (func)=>{
//     return async (req,res,next)=>{
//          try {
//             await func(req,res,next)
//          } catch (err) {
//             res.status(err.code || 500).json({
//                 success:false,
//                 message:err.message || "Something went wrong",
//                 errors:err.errors || []
//             })
//          }
//     }
// } 

export {asyncHandler};