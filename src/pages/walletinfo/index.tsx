import React from 'react'
import MyWalletComponent from './MyWalletComponent'

const walletInfoPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <MyWalletComponent/>
      </div>
    </div>
  )
}

export default walletInfoPage