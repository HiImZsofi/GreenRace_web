package com.example.greenrace

import retrofit2.Call
import retrofit2.http.*

interface ApiInterface {

    @Headers("Content-Type: application/json")
    @POST("register")
    fun sendReq(@Body requestModelRegistration: RequestModelRegistration): Call<RegistrationResponseModel>

    @Headers("Content-Type: application/json")
    @POST("login")
    fun sendReq(@Body requestModelLogin: RequestModelLogin): Call<ResponseModel>

    @Headers("Content-Type: application/json")
    @GET("logRoute")
    fun getData(): Call<RouteData>

    @Headers("Content-Type: application/json")
    @POST("get/routeData")
    fun getStopsData(@Body requestModelStopsData: RequestModelStopsData): Call<StopsData>

    @Headers("Content-Type: application/json")
    @POST("get/distance")
    fun getDistance(@Header("token") token: String, @Body requestModelLogRoute: RequestModelLogRoute): Call<ResponseModelLogRoute>

    @Headers("Content-Type: application/json")
    @GET("check/completion")
    fun getAchievements(@Header("Authorization") token: String) : Call<ResponseModelAchievements>
    
    @Headers("Content-Type: application/json")
    @GET("userPage")
    fun sendReqUser(@Header("Authorization") token:String) :Call<ResponseModelUserPage>

    @Headers("Content-Type: application/json")
    @POST("/settings")
    fun sendSettings(@Header("Authorization") token: String, @Body requestModelSettingsPage: RequestModelSettingsPage) : Call<RegistrationResponseModel>

    @Headers("Content-Type: application/json")
    @POST("/profpicset")
    fun sendProfilepic(@Header("Authorization") token: String, @Body requestModelProfilepicSetter : RequestModelProfilepicSetter ) :Call<RegistrationResponseModel>

    @Headers("Content-Type: application/json")
    @GET("chartData")
    fun sendReqChartData(@Header("authorization") token:String) :Call<ResponseModelUserPageChart>

    @Headers("Content-Type: application/json")
    @GET("rankPage")
    fun getRankData(@Header("authorization") token: String) : Call<ResponseModelRankList>

    @Headers("Content-Type: application/json")
    @GET("routePage")
    fun getLoggedRoutes(@Header("authorization") token: String) : Call<ResponseModelLoggedRoutes>
}