

import React from 'react';
import { Input } from "./Input"
import "../styles/Footer.css"
import "../styles/Components.css"
import "../styles/dashboard.css"

const Footer = () => {
  return (<footer className="footer">
          <div className="footer__content">
            <div className="footer__section footersp">
             
              <ul>
                <li>
                  <a href="#">Services</a>
                </li>
                <li>
                  <a href="#">Pricing</a>
                </li>
                <li>
                  <a href="#">Contact</a>
                </li>
              </ul>
            </div>
            <div className="footer__section footersp">
              
              <ul>
                <li>
                  <a href="#">Terms of Services</a>
                </li>
                <li>
                  <a href="#">Terms of Sales</a>
                </li>
                <li>
                  <a href="#">Privacy policy & Cookies</a>
                </li>
              </ul>
            </div>
            <div className="footer__section footersp">
              
              <ul>
                <li>
                  <a href="#">For subject-matter experts</a>
                </li>
                <li>
                  <a href="#">Help center</a>
                </li>
                <li>
                  <a href="#">Information for candidates</a>
                </li>
              </ul>
            </div>
            <div className="footer__sections">
              
              <div className="footer__newsletter">
                <div className="footer__social">
                  <span className="footer__social-icon"><img src="../assets/twitter.png"></img></span>
                  <span className="footer__social-icon"><img src="../assets/facebook.png"></img></span>
                  <span className="footer__social-icon"><img src="../assets/insta.png"></img></span>
                  <span className="footer__social-icon"><img src="../assets/LinkedIn.png"></img></span>
                </div>
                <p>Subscribe our Newsletters to keep updated yourself with Current Revolution in Fitness Sector.</p>
                <div className="footer__newsletter-form">
                  <Input placeholder="Enter you email" className="footer__newsletter-input" />
                  <button className="footer__newsletter-btn">→</button>
                </div>
                
              </div>
            </div>
          </div>
          <div className="footer__copyright">© CertJob 2021. All rights reserved.</div>
        </footer>)
}
export default Footer
