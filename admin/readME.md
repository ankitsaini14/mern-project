{{URL}}/task/:id    method(get)      get user id and show its details
{{URL}}/task        method(post)     create a new user 
{{URL}}/task/:id    method(put)      user update
{{URL}}/task/:id    method(delete)   delete user

MIDDLEWARE 
client req--> middleware(req,res,next()) --> function(req,res)