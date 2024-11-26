// AboutUs.jsx
import React from 'react';
import './AboutUs.css';

function AboutUs() {
  return (
    <div className='container'>
      <h2 className='title'>About Our Project</h2>
      <p className='text'>Waste collection is a critical phase in waste management, directly influencing the overall efficiency of the system. The integration of the Internet of Things (IoT) into collection processes offers significant advantages by enabling real-time monitoring of container fill levels, optimizing collection routes, and reducing operational costs. IoT serves as a valuable technological solution to help businesses enhance their waste collection efficiency.

        In the context of this project, we are developing an IoT-based solution to streamline waste management and assist the waste collection company. This solution involves planning optimal routes to access bins and designing a web application for real-time monitoring of their fill levels, facilitating the timely emptying of full containers. Additionally, we have developed a deep learning model capable of predicting bin fill levels within a given time frame. Our solution proves effective in both preserving environmental cleanliness and optimizing waste collection operations for the company.</p>
      {/* Ajoutez ici le contenu que vous souhaitez afficher */}
    </div>
  );
}

export default AboutUs;
