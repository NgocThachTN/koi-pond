import React from 'react'
import { Link, Divider } from '@nextui-org/react'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'

function Footer() {
  return (
    <footer className="border-t border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold text-blue-600">Koi Ponds</h2>
            <p className="text-xs text-gray-600">Experts in Koi pond construction</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-4 md:mb-0">
            {/* <Link href="/" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
            <Link href="/services" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Services</Link>
            <Link href="/gallery" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Gallery</Link>
            <Link href="/contact" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Contact</Link> */}
          </div>
          <div className="flex space-x-4">
            <Link href="#" aria-label="Facebook"><FaFacebook size={18} className="text-gray-600 hover:text-blue-600 transition-colors" /></Link>
            <Link href="#" aria-label="Twitter"><FaTwitter size={18} className="text-gray-600 hover:text-blue-600 transition-colors" /></Link>
            <Link href="#" aria-label="Instagram"><FaInstagram size={18} className="text-gray-600 hover:text-blue-600 transition-colors" /></Link>
            <Link href="#" aria-label="LinkedIn"><FaLinkedin size={18} className="text-gray-600 hover:text-blue-600 transition-colors" /></Link>
          </div>
        </div>
        <Divider className="my-4" />
        <div className="text-center text-xs text-gray-600">
          <p>© 2024 Koi Ponds Construction. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
