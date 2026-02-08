import React from 'react';

const Footer = () => {
    return (
        <footer id="contact" className="footer-section">
            <div className="container text-center">
                <h2 className="text-4xl boho-heading mb-8 text-[var(--color-accent)]">The Jhopdi</h2>

                <div className="footer-content">
                    <div className="footer-column">
                        <h4>Visit Us</h4>
                        <p>Andawa, Khanupur</p>
                        <p>Prayagraj, Uttar Pradesh 221505</p>
                    </div>
                    <div className="footer-column">
                        <h4>Open Hours</h4>
                        <p>Mon - Fri: 11am - 10pm</p>
                        <p>Sat - Sun: 10am - 11pm</p>
                    </div>
                    <div className="footer-column">
                        <h4>Contact</h4>
                        <p>hello@thejhopdi.com</p>
                        <p>+91 93356 36716</p>
                    </div>
                </div>

                <div className="border-t border-gray-700 pt-8 text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} The Jhopdi. Designed with Good Vibes.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
