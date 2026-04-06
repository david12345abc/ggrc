import React from 'react';
import './Services.css';

const Services = () => {
  return (
    <section className="services" id="services">
      <div className="container">
        <h2 className="section-title">OUR SERVICES</h2>
        <p className="section-subtitle">
          GGRC Armenia offers a wide range of services, including
        </p>

        <div className="services__single">
          <div className="services__single-img">
            <img
              src="/images/hands.png"
              alt="Infertility Diagnosis and Treatment"
            />
          </div>
          <h3 className="services__single-title">
            INFERTILITY DIAGNOSIS AND TREATMENT (FOR WOMEN AND MEN)
          </h3>
        </div>
      </div>
    </section>
  );
};

export default Services;
