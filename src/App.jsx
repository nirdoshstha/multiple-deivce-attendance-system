import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router'
import Login from './component/frontend/auth/Login'
import { AuthProvider, useAuth } from './context/AuthContext'
import Profile from './component/frontend/Profile'
import PrivateRoutes from './component/PrivateRoutes'
import MasterLayout from './layout/backend/MasterLayout'
import Dashboard from './component/backend/Dashboard'
import Setting from './component/backend/setting/Setting'
import About from './component/backend/about/About'
import User from './component/backend/user/User'
import Role from './component/backend/role/Role'
import ShowRole from './component/backend/role/ShowRole'
import EditRole from './component/backend/role/EditRole'
import UserEdit from './component/backend/user/UserEdit'
import Permission from './component/backend/permission/Permission'
import Error403 from './component/errors/Error403'
import Gender from './component/backend/gender/Gender'
import Designation from './component/backend/designation/Designation'
import Vendor from './component/backend/vendor/Vendor'
import Trashed from './component/backend/vendor/Trashed'
import api from './api/api'
import VendorEdit from './component/backend/vendor/VendorEdit'
import Company from './component/backend/company/Company'
import CompanyEdit from './component/backend/company/CompanyEdit'
import CompanyTrashed from './component/backend/company/CompanyTrashed'
import Brand from './component/backend/brand/Brand'
import BrandEdit from './component/backend/brand/BrandEdit'
import Device from './component/backend/device/Device'
import DeviceEdit from './component/backend/device/DeviceEdit'
import CompanyDevice from './component/backend/company-device/CompanyDevice'
import CompanyDeviceShow from './component/backend/company-device/CompanyDeviceShow'
import CompanyDeviceTrashed from './component/backend/company-device/CompanyDeviceTrashed'

const App = () => {
  const { can } = useAuth();


  return (
    <div>


      <Routes>
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />

        <Route element={<PrivateRoutes />}>
          <Route path="/admin" element={<MasterLayout />}>

            <Route path="dashboard" element={<Dashboard />} />
            <Route path="setting" element={<Setting />} />
            <Route path="about" element={<About />} />


            <Route path="user" element={<User />} />
            <Route path="user/:id/edit" element={can('users.show') ? <UserEdit /> : <Error403 />} />

            {/* Role */}
            <Route path="role" element={<Role />} />
            <Route path="role/:id" element={<ShowRole />} />
            <Route path="role/edit/:id" element={<EditRole />} />

            {/* Permission */}
            <Route path="permission" element={<Permission />} />

            {/* Gender */}
            <Route path='gender' element={<Gender />} />
            <Route path='designation' element={<Designation />} />

            {/* Vendor */}
            <Route path='vendor' element={<Vendor />} />
            <Route path='vendor/trashed' element={<Trashed />} />
            <Route path='vendor/edit/:id' element={<VendorEdit />} />

            {/* Companies  */}
            <Route path='company' element={<Company />} />
            <Route path='company/trashed' element={<CompanyTrashed />} />
            <Route path='company/edit/:id' element={<CompanyEdit />} />

            {/* Company Devices */}

            <Route path='company-device' element={<CompanyDevice />} />
            <Route path='company-device/:id' element={<CompanyDeviceShow />} />
            <Route path='company-device/trashed' element={<CompanyDeviceTrashed />} />
            {/* Device Brand */}
            <Route path='device-brand' element={<Brand />} />
            <Route path='device-brand/edit/:id' element={<BrandEdit />} />

            {/* Devices */}
            <Route path='device' element={<Device />} />
            <Route path='device/edit/:id' element={<DeviceEdit />} />





          </Route>
        </Route>

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </div>

  )
}

export default App