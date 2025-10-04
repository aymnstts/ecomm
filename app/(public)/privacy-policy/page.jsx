'use client'
import { Shield, Lock, Database, Cookie, Users, FileText, Mail, AlertCircle } from 'lucide-react'

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Hero Section */}
            <div className="bg-slate-800 text-white py-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <Shield className="w-16 h-16 mx-auto mb-4" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
                    <p className="text-lg text-slate-300">
                        Your privacy is important to us. Learn how we collect, use, and protect your personal information.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-16">
                {/* Introduction */}
                <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                    <p className="text-slate-700 leading-relaxed mb-4">
                        Our website respects your privacy and seeks to protect your personal data. This privacy policy explains how we collect and use your personal data in certain circumstances. It also describes the procedures used to ensure the confidentiality of your information and determines your options regarding the collection, use, and disclosure of personal data.
                    </p>
                    <p className="text-slate-700 leading-relaxed mb-4">
                        By visiting the site directly or through another website, you accept the practices described in this policy. The protection of your data is very important to us. Therefore, your name and other information about you are used in accordance with the terms indicated in this privacy policy.
                    </p>
                    <p className="text-slate-700 leading-relaxed">
                        You can browse the site without having to provide personal data. Your personal identity remains anonymous throughout your visit to the site and is not exposed unless you have a special online account on the site that you access with a username and password.
                    </p>
                </div>

                {/* Section 1: Data We Collect */}
                <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                            <Database className="text-slate-800" size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">1. Data We Collect</h2>
                    </div>
                    
                    <p className="text-slate-700 leading-relaxed mb-4">
                        We may need to collect your information if you wish to place an order for goods on our site. We collect, store, and process your data necessary to continue your purchase on our site to secure any requests that may arise later, and to provide you with the services at our disposal.
                    </p>
                    
                    <p className="text-slate-700 leading-relaxed mb-4">
                        We may collect personal information including, but not limited to: name, gender, date of birth, email address, postal address, delivery address (if different), telephone number, payment details, and payment card details.
                    </p>

                    <div className="bg-slate-50 rounded-lg p-6 mb-4">
                        <h3 className="font-semibold text-slate-800 mb-3">How We Use Your Information:</h3>
                        <ul className="space-y-2 text-slate-700">
                            <li className="flex gap-2">
                                <span className="text-slate-800 font-medium">•</span>
                                <span>To process your requests and provide the services displayed on our site</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-slate-800 font-medium">•</span>
                                <span>To manage your account with us and verify your financial transactions on the internet</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-slate-800 font-medium">•</span>
                                <span>To audit data downloads from the site and identify site visitors</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-slate-800 font-medium">•</span>
                                <span>To conduct demographic research and send useful information about products and services</span>
                            </li>
                        </ul>
                    </div>

                    <p className="text-slate-700 leading-relaxed mb-4">
                        We may give your name and address to a third party in order to deliver your order (for example, delivery agent or supplier). We may be able to store details about your current order on our site, but we cannot retrieve it directly for security reasons.
                    </p>

                    <p className="text-slate-700 leading-relaxed">
                        By logging into your account on the site, you can view information and details of your purchases that you have requested or will soon submit. You must also commit to maintaining complete confidentiality when accessing your personal data. We assume no responsibility for the misuse of passwords, unless this misuse is caused by an error on our part.
                    </p>
                </div>

                {/* Section 2: Other Uses */}
                <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                            <FileText className="text-slate-800" size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">Other Uses of Your Personal Information</h2>
                    </div>

                    <p className="text-slate-700 leading-relaxed mb-4">
                        We may use your personal information in opinion polls and marketing studies, at your discretion, for statistical purposes while ensuring their complete confidentiality. You have the right to withdraw at any time. We do not send any responses to third parties. Your email address is only disclosed if you wish to participate in the contest.
                    </p>

                    <p className="text-slate-700 leading-relaxed mb-4">
                        We may send information about us, or about the site or our other sites, or about our products, sales, offers, newsletters, and other things related to companies affiliated with our group or our partners. If you do not wish to obtain this additional information, please click the "unsubscribe" link in any email sent to you, and we will stop sending you this information within seven business days of receiving your notification.
                    </p>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <div className="flex gap-3">
                            <Mail className="text-blue-600 flex-shrink-0" size={20} />
                            <p className="text-sm text-blue-800">
                                <strong>Marketing Communications:</strong> You can opt out of receiving marketing emails at any time by clicking the unsubscribe link or contacting us directly.
                            </p>
                        </div>
                    </div>

                    <h3 className="font-semibold text-slate-800 mb-3 mt-6">Competitions</h3>
                    <p className="text-slate-700 leading-relaxed">
                        As part of any competition, we use the data to inform winners and announce our offers. You can find more details on the terms of participation in each competition separately.
                    </p>
                </div>

                {/* Section 3: Third Parties */}
                <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                            <Users className="text-slate-800" size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">Third Parties and Links to Websites</h2>
                    </div>

                    <p className="text-slate-700 leading-relaxed mb-4">
                        We may transfer your information to other companies in our group or to our agents and subcontractors to help us with related transactions in accordance with the terms of this privacy policy. For example, we may turn to a third party to help us deliver products to you, receive payments from you, and use them for statistics or marketing research purposes, or to help our customer service team.
                    </p>

                    <p className="text-slate-700 leading-relaxed mb-4">
                        We may need to exchange information with a third party in order to protect ourselves against fraud and reduce credit risk. In the event that our company or part of it is sold, we may need to transfer our databases that contain your personal information.
                    </p>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="flex gap-3">
                            <AlertCircle className="text-amber-600 flex-shrink-0" size={20} />
                            <p className="text-sm text-amber-800">
                                Outside of what is stated in this privacy policy, we will not sell your personal data or disclose it to a third party without obtaining your prior approval, unless it is necessary for the purposes stipulated in this policy, or if we are required to do so by law.
                            </p>
                        </div>
                    </div>

                    <p className="text-slate-700 leading-relaxed mt-4">
                        The site may contain third-party advertisements or links to other websites or frames of other sites. We inform you that we are not responsible for the privacy policy of a third party or the content of these policies applied in other sites, nor are we responsible for third parties to whom we transfer your data in accordance with the privacy policy.
                    </p>
                </div>

                {/* Section 4: Cookies */}
                <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                            <Cookie className="text-slate-800" size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">2. Cookies</h2>
                    </div>

                    <p className="text-slate-700 leading-relaxed mb-4">
                        Accepting cookies is not a prerequisite for visiting the site. However, we note that the "cart" functions of the site cannot be used and requested for any purpose without enabling cookies.
                    </p>

                    <p className="text-slate-700 leading-relaxed mb-4">
                        Cookies are small text files that allow our server to identify your computer as a unique user when visiting certain pages of the site. Your browser stores these files on your computer's hard drive. Cookies can be used to discover an IP (Internet Protocol) address, saving you time when you are on the site or want to visit it.
                    </p>

                    <p className="text-slate-700 leading-relaxed mb-4">
                        We use cookies to ensure your comfort when browsing this site (for example, remembering your identity when you want to modify your cart without having to re-enter your email address) and not to obtain or use other information about you (for example for targeted marketing purposes).
                    </p>

                    <div className="bg-slate-50 rounded-lg p-6 mb-4">
                        <h3 className="font-semibold text-slate-800 mb-3">Google Analytics</h3>
                        <p className="text-slate-700 leading-relaxed">
                            This website uses Google Analytics, a service provided by Google to analyze web pages. To analyze how users use the site, Google Analytics is based on cookies. Google will transfer the information generated by cookies about your use of this website (including your IP address) to servers in the United States where it will be stored. Google will use this information to evaluate your use of the site, prepare reports for website operators on its activity, and provide other services related to website activity and internet use.
                        </p>
                    </div>

                    <p className="text-slate-700 leading-relaxed">
                        You can refuse to use cookies by selecting the appropriate settings on your browser, but remember that you will not be able to enjoy all the features of the site. By using this site, you agree that Google uses your data as described and for the purposes described above.
                    </p>
                </div>

                {/* Section 5: Security */}
                <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                            <Lock className="text-slate-800" size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">3. Security</h2>
                    </div>

                    <p className="text-slate-700 leading-relaxed mb-4">
                        We use appropriate security techniques and procedures to prevent any unauthorized or illegal access to your information or its loss or destruction. When we collect data through the website, we store your personal information in a database within a secure online server. We use firewall systems on our servers.
                    </p>

                    <p className="text-slate-700 leading-relaxed mb-4">
                        When we collect payment card information electronically, we protect it using encryption, such as Secure Sockets Layer (SSL). Therefore, it is difficult for any hacker to decrypt your information, although we cannot guarantee 100% protection.
                    </p>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <div className="flex gap-3">
                            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                            <p className="text-sm text-red-800">
                                <strong>Important:</strong> We strongly advise you not to send all your credit or debit card details when communicating with us electronically and without encryption.
                            </p>
                        </div>
                    </div>

                    <p className="text-slate-700 leading-relaxed">
                        We put in place direct physical, electronic, and procedural safeguards on the process of collecting, storing, and disclosing your information. Our security procedures require that we sometimes ask you to verify your identity before disclosing your personal information to you. It is your responsibility to protect your password and computer from any unauthorized use.
                    </p>
                </div>

                {/* Section 6: Customer Rights */}
                <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                            <Shield className="text-slate-800" size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">4. Customer Rights</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-slate-50 rounded-lg p-4">
                            <h3 className="font-semibold text-slate-800 mb-2">Right to Access</h3>
                            <p className="text-slate-700">
                                If you are concerned about your data, you have the right to request access to the personal data we hold about you or that has been previously transmitted to us.
                            </p>
                        </div>

                        <div className="bg-slate-50 rounded-lg p-4">
                            <h3 className="font-semibold text-slate-800 mb-2">Right to Correction</h3>
                            <p className="text-slate-700">
                                You have the right to ask us to correct any errors in your personal data, and this is done free of charge.
                            </p>
                        </div>

                        <div className="bg-slate-50 rounded-lg p-4">
                            <h3 className="font-semibold text-slate-800 mb-2">Right to Opt-Out</h3>
                            <p className="text-slate-700">
                                You also have the right to ask us, at any time, to stop using your personal data for direct marketing purposes.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="bg-slate-800 text-white rounded-xl shadow-sm p-8 text-center">
                    <Mail className="w-12 h-12 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-4">Questions About Our Privacy Policy?</h2>
                    <p className="text-slate-300 mb-6">
                        If you have any questions or concerns about how we handle your personal data, please don't hesitate to contact us.
                    </p>
                    <a 
                        href="/contact" 
                        className="inline-block bg-white text-slate-800 px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition"
                    >
                        Contact Us
                    </a>
                </div>

                {/* Last Updated */}
                <div className="text-center mt-8">
                    <p className="text-sm text-slate-500">
                        Last updated: October 2025
                    </p>
                </div>
            </div>
        </div>
    )
}