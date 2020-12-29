module.exports = {

	Error401:{
		statusCode:401,
		message:"Unauthorised access"
	},
	Error400:{
		statusCode:400,
		message:"Bad Request."
	},
	Error404:{
		statusCode:404,
		message:"Data not found."
	},
	Error409:(msg,data)=>
	{
    if(data)
    {
      return {
  			statusCode: 409,
  			message: msg + " already exists.",
        error: data
  		}
    }
    else
		return {
			statusCode: 409,
			message: msg + " already exists."
		}
	},
	Error500:(data)=>
	{
		if(data)
			data = data
		else
			data = "Something went wrong, Please try again after some time."
		return {
			statusCode:500,
			message:data
		}
	},
	success200:(message,data)=>{
		if(!data)
			return {
				statusCode:200,
				message:message
			}
		if(!message)
			return {
				statusCode:200,
				data:data
			}
		return {
			statusCode:200,
			message:message,
			data:data
		}
	},

	error400: (message) => {
		return {
			statusCode: 400,
			message: message + " missing."
		}
	},

	err400: (message) => {
		return {
			statusCode: 400,
			message: message
		}
	},

	error404: (message) => {
		return {
			statusCode: 404,
			message: message
		}
	},

	Err409: (message) => {
		return {
			statusCode: 409,
			message: message
		}
	}
}


