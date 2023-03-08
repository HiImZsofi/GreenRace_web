package com.example.greenrace

import android.Manifest
import android.app.AlertDialog
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.location.Location
import android.location.LocationManager
import android.os.Bundle
import android.provider.Settings
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.OnMapReadyCallback
import com.google.android.gms.maps.SupportMapFragment
import com.google.android.gms.maps.model.BitmapDescriptorFactory
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.MarkerOptions

internal class MapsActivity : AppCompatActivity(), OnMapReadyCallback {

    private val PERMISSIONS_REQUEST_ACCESS_FINE_LOCATION = 1
    private var mLocationPermissionGranted = false

    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private lateinit var mMap: GoogleMap
    private lateinit var mapFragment : SupportMapFragment

    private var lat = 0.0
    private var lng = 0.0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_maps)

        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
        mapFragment = supportFragmentManager
            .findFragmentById(R.id.map) as SupportMapFragment

        getLocationPermission()

        initMap(mapFragment)
    }

    private fun initMap(mapFragment: SupportMapFragment) {
        val locationManager:LocationManager = getSystemService(Context.LOCATION_SERVICE) as LocationManager
//        mapFragment.getMapAsync { mMap ->
//            val notSydney = LatLng(47.4980635, 19.0472096)
//            mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(notSydney, 10F))
//        }
        if(!locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)){
            val builder = AlertDialog.Builder(this)
            builder.setTitle("Kapcsold be a GPS-t")
                .setMessage("Az alkalmazás helyes működéséhez a helymeghatározás bekapcsolása szükséges")
                .setCancelable(false)
                .setPositiveButton("GPS bekapcsolása") { _, _ ->
                    // Open location settings screen
                    val intent = Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS)
                    startActivityForResult(intent, 1)
                }
            val alert = builder.create()
            alert.show()
        }else{
            try {
                fusedLocationClient.lastLocation
                    .addOnSuccessListener { location: Location? ->
                        // Got last known location. In some rare situations this can be null.
                        if (location != null) {
                            try {
                                lat = location.latitude
                                lng = location.longitude
                                mapFragment.getMapAsync(this)
                            } catch (e: SecurityException) {
                                Log.e("Security Exception", e.message.toString())
                            }
                        } else {
                            mapFragment.getMapAsync { mMap ->
                                val notSydney = LatLng(47.4980635, 19.0472096)
                                mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(notSydney, 10F))
                            }
                        }
                    }
            } catch (e: SecurityException) {
                // Handle exception
                Log.e("Security Exception", e.message.toString())
            }
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == 1) {
            val locationManager = getSystemService(Context.LOCATION_SERVICE) as LocationManager
            if (locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
                initMap(mapFragment)
            }
        }
    }

    override fun onMapReady(googleMap: GoogleMap) {
        mMap = googleMap

        // Add a marker in Sydney and move the camera
        val sydney = LatLng(lat, lng)
        mMap.addMarker(
            MarkerOptions()
                .position(sydney)
                .title("Te most itt vagy")
                .icon(BitmapDescriptorFactory.defaultMarker(140F))
        )?.showInfoWindow()
        mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(sydney, 17F))
    }

    private fun getLocationPermission() {
        if (ContextCompat.checkSelfPermission(
                this.applicationContext,
                Manifest.permission.ACCESS_FINE_LOCATION
            )
            == PackageManager.PERMISSION_GRANTED
        ) {
            mLocationPermissionGranted = true
        } else {
            ActivityCompat.requestPermissions(
                this,
                arrayOf(Manifest.permission.ACCESS_FINE_LOCATION),
                PERMISSIONS_REQUEST_ACCESS_FINE_LOCATION
            )
        }
    }

    override fun onRequestPermissionsResult(
        requestCode: Int, permissions: Array<String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        mLocationPermissionGranted = false
        when (requestCode) {
            PERMISSIONS_REQUEST_ACCESS_FINE_LOCATION -> {
                if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    mLocationPermissionGranted = true
                }
            }
        }
    }


}

      