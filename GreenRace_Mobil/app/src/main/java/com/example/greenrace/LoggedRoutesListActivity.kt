package com.example.greenrace

import android.icu.text.SimpleDateFormat
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity
import com.example.greenrace.sharedPreferences.TokenUtils
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class LoggedRoutesListActivity : AppCompatActivity() {
    private lateinit var loggedRoutesView: ListView

    private lateinit var loggedRoutes: List<LoggedRoute>

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_logged_routes_list)

        initElements()
        getLoggedRoutesData()
    }


    //Get list of the logged routes of the current user
    //Then store it in a LoggedRoute type list
    private fun getLoggedRoutesData() {
        val response = ServiceBuilder.buildService(ApiInterface::class.java)
        val token: String = TokenUtils(this@LoggedRoutesListActivity).getAccessToken()!!
        response.getLoggedRoutes("Bearer $token").enqueue(
            object : Callback<ResponseModelLoggedRoutes> {
                override fun onResponse(
                    call: Call<ResponseModelLoggedRoutes>,
                    response: Response<ResponseModelLoggedRoutes>
                ) {
                    //Store the achievements
                    loggedRoutes = response.body()!!.loggedRoutes
                    setLoggedRoutesListViewAdapter()
                }

                override fun onFailure(call: Call<ResponseModelLoggedRoutes>, t: Throwable) {
                    Log.e("Error", t.toString())
                }
            }
        )
    }

    //Set the list as an adapter for the list view
    private fun setLoggedRoutesListViewAdapter() {
        val simpleDateFormat = SimpleDateFormat("yyyy.MM.dd")

        val adapter = object : ArrayAdapter<LoggedRoute>(
            this@LoggedRoutesListActivity,
            R.layout.logged_routes_list_item,
            loggedRoutes
        ) {
            @RequiresApi(Build.VERSION_CODES.O)
            override fun getView(postion: Int, convertView: View?, parent: ViewGroup): View {
                val view = convertView ?: LayoutInflater.from(context)
                    .inflate(R.layout.logged_routes_list_item, parent, false)
                val item = getItem(postion)


                view.findViewById<TextView>(R.id.loggedRouteDate).text =
                    simpleDateFormat.format(item?.date)
                view.findViewById<TextView>(R.id.loggedRouteLineNumber).text = item?.line
                view.findViewById<TextView>(R.id.loggedRouteEmission).text =
                    "${item?.emission.toString()} gramm"

                return view
            }
        }

        //Add a header view to the listview to mark the names of the columns
        //It uses the logged_routes_list_item with hardcoded strings
        // so the formatting matches the list items
        val headerView = LayoutInflater.from(this@LoggedRoutesListActivity)
            .inflate(R.layout.logged_routes_list_item, null)
        loggedRoutesView.addHeaderView(headerView)

        loggedRoutesView.adapter = adapter
    }

    private fun initElements() {
        loggedRoutesView = findViewById(R.id.loggedRoutesList)
    }
}