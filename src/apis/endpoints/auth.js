import client from "@/apis/apiClient/client";

export const registerEmployee = async(name,username,age,role,position,password)=>{
    return await client.post("/employees/register",{name,username,age,role,password,position});    
}

export const login = async(username,password)=>{
    return await client.post("/employees/login",{username,password});    
}

export const updateEmployeeInfo = async(id,name=null,username=null,age=null,role=null,position=null)=>{
    const body = {}
    if (name) body.name = name;
    if (username) body.username = username;
    if (age) body.age = age;
    if (role) body.role = role;
    if (position) body.position = position;

    return await client.put(`/employees/${id}`,body);
}

export const getEmployees = async(limit,offset)=>{
    return await client.get(`/employees?limit=${limit}&offset=${offset}`);
}

export const getFilteredEmployees = async(limit,offset,role=null,position=null,status=null,available=null)=>{
    return await client.get(`/employees/filtered?limit=${limit}&offset=${offset}&role=${role}&position=${position}&status=${status}&available=${available}`);

}
//for teams
export const getAllEmployees = async()=>{
    return await client.get(`/employees/all`);
}

export const resetPassword = async(password,candidatePassword)=>{
    return await client.post("/employees/reset-password",{password,candidatePassword});
}

export const forgotPassword = async(username,newPassword)=>{
    return await client.post("/employees/forgot-password",{username,newPassword}); //only admin should be allowed to use this endpoint -- already implemented in backend, but not in frontend
}

export const deleteEmployee = async(id)=>{
    return await client.delete(`/employees/${id}`);
}

