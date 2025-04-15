import React from 'react'
import MinBanner from '../components/MinBanner.jsx'
import Categories from '../components/Categories.jsx'
import BestSeller from '../components/BestSeller.jsx'
import BottomBanner from '../components/BottomBanner.jsx'
import NewsLetter from '../components/NewsLetter.jsx'

const Home = () => {
  return (
    <div className='mt-10'>
        <MinBanner/>
        <Categories/>
        <BestSeller/>
        <BottomBanner/>
        <NewsLetter/>
    </div>
  )
}

export default Home