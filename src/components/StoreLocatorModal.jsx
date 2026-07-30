import React, { useState } from 'react';
import { X, MapPin, Phone, Clock, CheckCircle2, ExternalLink, Navigation } from 'lucide-react';
import './StoreLocatorModal.css';

export const officialStores = [
  {
    id: 1,
    name: 'Çeyza AVM Kanalboyu Şubesi',
    city: 'Bursa / Osmangazi',
    address: 'Kanalboyu Cad. No: 42, Osmangazi / Bursa',
    phone: '0224 220 00 01',
    hours: 'Haftanın her günü 09:00 - 21:00',
    mapUrl: 'https://maps.google.com/maps?q=Bursa+Kanalboyu&t=&z=15&ie=UTF8&iwloc=&output=embed',
    pickup: true
  },
  {
    id: 2,
    name: 'Çeyza AVM Emek Şubesi',
    city: 'Bursa / Osmangazi',
    address: 'Emek Adnan Menderes Mah. Turgut Özal Cad. No: 15, Osmangazi / Bursa',
    phone: '0224 220 00 02',
    hours: 'Haftanın her günü 09:00 - 21:00',
    mapUrl: 'https://maps.google.com/maps?q=Bursa+Emek&t=&z=15&ie=UTF8&iwloc=&output=embed',
    pickup: true
  },
  {
    id: 3,
    name: 'Çeyza AVM Yeşilyayla Şubesi',
    city: 'Bursa / Yıldırım',
    address: 'Yeşilyayla Cad. No: 78, Yıldırım / Bursa',
    phone: '0224 220 00 03',
    hours: 'Haftanın her günü 09:00 - 21:00',
    mapUrl: 'https://maps.google.com/maps?q=Bursa+Ye%C5%9Filyayla&t=&z=15&ie=UTF8&iwloc=&output=embed',
    pickup: true
  },
  {
    id: 4,
    name: 'Çeyza AVM Yavuzselim Şubesi',
    city: 'Bursa / Yıldırım',
    address: 'Yavuzselim Mah. Su Deposu Cad. No: 24, Yıldırım / Bursa',
    phone: '0224 220 00 04',
    hours: 'Haftanın her günü 09:00 - 21:00',
    mapUrl: 'https://maps.google.com/maps?q=Bursa+Yavuzselim&t=&z=15&ie=UTF8&iwloc=&output=embed',
    pickup: true
  },
  {
    id: 5,
    name: 'Çeyza AVM Orhangazi Şubesi',
    city: 'Bursa / Orhangazi',
    address: 'Yalova Cad. No: 88, Orhangazi / Bursa',
    phone: '0224 573 00 05',
    hours: 'Haftanın her günü 09:00 - 20:30',
    mapUrl: 'https://maps.google.com/maps?q=Orhangazi+Bursa&t=&z=15&ie=UTF8&iwloc=&output=embed',
    pickup: true
  },
  {
    id: 6,
    name: 'Çeyza AVM Kütahya Tavşanlı Şubesi',
    city: 'Kütahya / Tavşanlı',
    address: 'Cumhuriyet Cad. No: 34, Tavşanlı / Kütahya',
    phone: '0274 614 00 06',
    hours: 'Haftanın her günü 09:00 - 20:30',
    mapUrl: 'https://maps.google.com/maps?q=K%C3%BCtahya+Tav%C5%9Fanl%C4%B1&t=&z=15&ie=UTF8&iwloc=&output=embed',
    pickup: true
  },
  {
    id: 7,
    name: 'Çeyza AVM Kent Meydanı Şubesi',
    city: 'Bursa / Osmangazi',
    address: 'Santral Garaj Mah. Kıbrıs Şehitleri Cad. No: 12 (Kent Meydanı Yakını), Osmangazi / Bursa',
    phone: '0224 220 00 07',
    hours: 'Haftanın her günü 10:00 - 22:00',
    mapUrl: 'https://maps.google.com/maps?q=Bursa+Kent+Meydan%C4%B1&t=&z=15&ie=UTF8&iwloc=&output=embed',
    pickup: true
  }
];

export default function StoreLocatorModal({ isOpen, onClose }) {
  const [selectedStore, setSelectedStore] = useState(officialStores[0]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="store-modal-content retail-card map-layout-modal" onClick={(e) => e.stopPropagation()}>
        
        <button className="modal-close-btn" onClick={onClose}>
          <X size={22} />
        </button>

        <div className="store-modal-header">
          <div className="store-title-group">
            <MapPin size={24} className="text-rose" />
            <div>
              <h3>Çeyza AVM Mağazalarımız & Konumlar</h3>
              <p>7 resmi şubemizden online siparişlerinizi ücretsiz teslim alabilirsiniz.</p>
            </div>
          </div>
        </div>

        <div className="store-map-wrapper">
          
          {/* Store List Column */}
          <div className="store-list-col">
            <span className="store-list-badge">✨ 7 Resmi Şubemiz</span>

            <div className="store-items-scroll">
              {officialStores.map((store) => (
                <div 
                  key={store.id} 
                  className={`store-card-item ${selectedStore.id === store.id ? 'active-store' : ''}`}
                  onClick={() => setSelectedStore(store)}
                >
                  <div className="store-item-top">
                    <span className="city-pill">{store.city}</span>
                    <span className="pickup-pill"><CheckCircle2 size={12} /> Mağazadan Teslim</span>
                  </div>
                  <h4 className="store-item-name">{store.name}</h4>
                  <p className="store-item-address"><MapPin size={13} /> {store.address}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Map Column */}
          <div className="store-map-col">
            <div className="active-store-details">
              <div className="active-detail-header">
                <h4>{selectedStore.name}</h4>
                <span className="city-tag">{selectedStore.city}</span>
              </div>
              <p className="active-address"><MapPin size={15} /> {selectedStore.address}</p>
              <div className="active-meta-row">
                <span><Phone size={14} /> {selectedStore.phone}</span>
                <span><Clock size={14} /> {selectedStore.hours}</span>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="map-iframe-container">
              <iframe 
                title={selectedStore.name}
                src={selectedStore.mapUrl}
                width="100%" 
                height="320" 
                style={{ border: 0, borderRadius: '12px' }} 
                allowFullScreen="" 
                loading="lazy"
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
