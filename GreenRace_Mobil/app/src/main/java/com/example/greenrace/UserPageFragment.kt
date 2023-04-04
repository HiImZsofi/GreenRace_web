package com.example.greenrace

import android.content.Context
import android.graphics.Color
import android.os.Build
import android.os.Bundle
import android.text.Html
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.annotation.RequiresApi
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import com.example.greenrace.sharedPreferences.TokenUtils
import com.github.mikephil.charting.data.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response


class UserPageFragment : Fragment() {
    private lateinit var pointsText: TextView
    private lateinit var achievementsView: ListView
    private lateinit var barChart: com.github.mikephil.charting.charts.BarChart

    private lateinit var mContext: Context
    private lateinit var AchievementsList: List<Achievement>
    override fun onAttach(context: Context) {
        super.onAttach(context)
        mContext = context
    }
    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_user_page, container, false)
    }
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        pointsText = view.findViewById(R.id.ponts_textview)
        barChart = view.findViewById(R.id.user_barChart)
        achievementsView = view.findViewById(R.id.achievementList)
        getData()
        getAchievementData(object : AchievementDataCallback {
            override fun onAchievementDataReceived(achievementsList: List<Achievement>) {
                AchievementsList = achievementsList
                setAchievementsListViewAdapter()
            }

            override fun onFailure(errorMessage: String) {
                Log.e("Error", errorMessage)
            }
        })
        getChartData()
    }

    private fun getColoredString(text: String, color: String): String? {
        return "<font color=$color>$text</font>"
    }
    private fun updateUserInfo(points: Int?){
        var zpoint = getColoredString("Zöldpont", "#006400");
        pointsText.setText(Html.fromHtml(points.toString() + " " + zpoint + "-od van"))
    }

    private fun getData() {
        val response = ServiceBuilder.buildService(ApiInterface::class.java)
        val tokenUtils = TokenUtils(requireContext())
        val token = tokenUtils.getAccessToken()
        val requestUserData = "Bearer $token"

        response.sendReqUser(requestUserData).enqueue(
            object : Callback<ResponseModelUserPage> {
                override fun onResponse(
                    call: Call<ResponseModelUserPage>,
                    response: Response<ResponseModelUserPage>
                ) {
                    if (token != null) {
                        val points = response.body()?.userpagedata?.points

                        // Update UI
                        updateUserInfo(points)
                    }
                }

                override fun onFailure(call: Call<ResponseModelUserPage>, t: Throwable) {
                    Log.i("Error", t.toString())
                }
            }
        )
    }
    interface AchievementDataCallback {
        fun onAchievementDataReceived(achievementsList: List<Achievement>)
        fun onFailure(errorMessage: String)
    }
    //GETs the progress for each achievement for the current user from the backend
    private fun getAchievementData(callback: AchievementDataCallback) {
        val response = ServiceBuilder.buildService(ApiInterface::class.java)
        val tokenUtils = TokenUtils(requireContext())
        val token = tokenUtils.getAccessToken()
        val requestUserData = "Bearer $token"
        response.getAchievements(requestUserData).enqueue(
            object : Callback<ResponseModelAchievements> {
                override fun onResponse(
                    call: Call<ResponseModelAchievements>,
                    response: Response<ResponseModelAchievements>
                ) {
                    //Store the achievements
                    if (response.isSuccessful) {
                        val achievements = response.body()?.achievements
                        if (achievements != null) {
                            callback.onAchievementDataReceived(achievements)
                        }
                    } else {
                        callback.onFailure("Failed to get achievements: ${response.code()}")
                    }
                }

                override fun onFailure(call: Call<ResponseModelAchievements>, t: Throwable) {
                    callback.onFailure(t.toString())
                }
            }
        )
    }
    //Set the achievements list as the list used by the adapter of the AchievementsListView
    //It sets the name, progress, status of the achievement
    // and the achievement description if you hold down one of the list items
    fun setAchievementsListViewAdapter() {
        if (isAdded()) {
        val adapter = object : ArrayAdapter<Achievement>(
            requireContext(),
            R.layout.achievement_list_item,
            AchievementsList
        ) {
            @RequiresApi(Build.VERSION_CODES.O)
            override fun getView(postion: Int, convertView: View?, parent: ViewGroup): View {
                val view = convertView ?: LayoutInflater.from(context)
                    .inflate(R.layout.achievement_list_item, parent, false)
                val item = getItem(postion)

                view.findViewById<LinearLayout>(R.id.achievementListItem).tooltipText =
                    item!!.description
                view.findViewById<TextView>(R.id.achievementName).text = item?.name
                view.findViewById<ProgressBar>(R.id.achievementProgress).progress = item!!.progress
                view.findViewById<CheckBox>(R.id.achievementCompletion).isChecked = item.completed

                return view
            }
        }
        achievementsView.adapter = adapter
    }}

    //No function yet
    private fun getChartData() {
        val response = ServiceBuilder.buildService(ApiInterface::class.java)
        val tokenUtils = TokenUtils(requireContext())
        val token = tokenUtils.getAccessToken()
        val requestChartData = "Bearer $token"

        response.sendReqChartData(requestChartData).enqueue(
            object : Callback<ResponseModelUserPageChart>{
                override fun onResponse(
                    call: Call<ResponseModelUserPageChart>,
                    response: Response<ResponseModelUserPageChart>
                ){
                    val chartdata = response.body()?.userpagechartdata
                    if (chartdata != null) {
                        val chartlist = fillChartList(chartdata)
                        setChartData(chartlist)
                    }
                }
                override fun onFailure(call: Call<ResponseModelUserPageChart>, t: Throwable) {
                    Log.e("Error", t.toString())
                }
            }
        )
    }
    private fun setChartData(chartdata: List<Number>){
        if (isAdded()) {
        // Create a new data set and add the values to it
        val data = ArrayList<BarEntry>()
        for (i in 0 until chartdata.size) {
            data.add(BarEntry(i.toFloat(), chartdata[i].toFloat()))
        }
        val dataSet = BarDataSet(data, "Pontok")
            barChart.getDescription().setEnabled(false)
        dataSet.color = ContextCompat.getColor(requireContext(), R.color.teal_700)

        val barData = BarData(dataSet)

        barChart.data = barData
        barChart.setFitBars(true)
        barChart.invalidate()

    }}
    private fun fillChartList(source: List<ChartData>): List<Double> {
        val target = mutableListOf<Double>()
        for (i in 0 until 10) {
            if (i < source.size) {
                target.add(source[i].emission)
            } else {
                target.add(0.0)
            }
        }
        return target
    }
    private fun getEntryList(chartdata: List<Number>): List<Entry> {
        val entries = mutableListOf<Entry>()
        for ((index, value) in chartdata.withIndex()) {
            entries.add(Entry(index.toFloat(), value.toFloat()))
        }
        return entries
    }
}