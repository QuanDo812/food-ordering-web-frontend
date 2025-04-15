export const uploadToCloudinary=async(pics)=>{
  if(pics){
      const data=new FormData();
      data.append("file", pics)
      data.append("upload_preset","twitter_clone");
      data.append("cloud_name","dcocjmai0")

      const res = await fetch("https://api.cloudinary.com/v1_1/dcocjmai0/image/upload",{
        method:"post",
        body:data
      })

      const fileData=await res.json();
      return fileData.url.toString();        
  }
  else console.log("error from upload function")

}