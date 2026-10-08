import { useState } from 'react'

const API_URL = 'http://localhost:3000'

const TURKIYE_ILLER = ['Adana','Adıyaman','Afyonkarahisar','Ağrı','Aksaray','Amasya','Ankara','Antalya','Ardahan','Artvin','Aydın','Balıkesir','Bartın','Batman','Bayburt','Bilecik','Bingöl','Bitlis','Bolu','Burdur','Bursa','Çanakkale','Çankırı','Çorum','Denizli','Diyarbakır','Edirne','Elazığ','Erzincan','Erzurum','Eskişehir','Gaziantep','Giresun','Gümüşhane','Hakkari','Hatay','Iğdır','Isparta','İstanbul','İzmir','Kahramanmaraş','Karabük','Karaman','Kars','Kastamonu','Kayseri','Kırıkkale','Kırklareli','Kırşehir','Kilis','Kocaeli','Konya','Kütahya','Malatya','Manisa','Mardin','Mersin','Muğla','Muş','Nevşehir','Niğde','Ordu','Osmaniye','Rize','Sakarya','Samsun','Siirt','Sinop','Sivas','Şanlıurfa','Şırnak','Tekirdağ','Tokat','Trabzon','Tunceli','Uşak','Van','Yalova','Yozgat','Zonguldak']

function AddListingModal({ onClose, onSuccess, user }) {
  const [form, setForm] = useState({
    title: '',
    city: '',
    district: '',
    price: '',
    type: 'Satılık',
    rooms: '3+1',
    area: '',
    bath: '',
    phone: '',
    img: '',
    desc: ''
  })
  const [loading, setLoading] = useState(false)

  const update = (field, value) => {
    setForm({ ...form, [field]: value })
  }

  const handleSubmit = async () => {
    if (!form.title || !form.city || !form.price) {
      alert('⚠️ Başlık, il ve fiyat zorunlu!')
      return
    }

    const location = form.district ? `${form.district}, ${form.city}` : form.city

    const newListing = {
      title: form.title,
      location,
      price: parseFloat(form.price),
      type: form.type,
      rooms: form.rooms,
      area: parseFloat(form.area) || 100,
      bath: parseFloat(form.bath) || 1,
      phone: form.phone,
      img: form.img || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
      desc: form.desc,
      ownerId: user?.id,
      ownerName: user?.username
    }

    setLoading(true)
    try {
      const res = await fetch(API_URL + '/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newListing)
      })
      
      if (res.ok) {
        onSuccess()
        onClose()
      } else {
        alert('❌ Kaydedilemedi')
      }
    } catch (err) {
      alert('❌ Bağlantı hatası')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-body">
          <h2>➕ Yeni İlan Ekle</h2>
          
          <div className="form-grid">
            <div className="full">
              <label>Başlık *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="Örn: Deniz Manzaralı Daire"
              />
            </div>
            
            <div>
              <label>İl *</label>
              <select value={form.city} onChange={(e) => update('city', e.target.value)}>
                <option value="">İl Seç</option>
                {TURKIYE_ILLER.map(il => (
                  <option key={il} value={il}>{il}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label>İlçe</label>
              <input
                type="text"
                value={form.district}
                onChange={(e) => update('district', e.target.value)}
                placeholder="Örn: Kadıköy"
              />
            </div>
            
            <div>
              <label>Fiyat (₺) *</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => update('price', e.target.value)}
              />
            </div>
            
            <div>
              <label>Tip</label>
              <select value={form.type} onChange={(e) => update('type', e.target.value)}>
                <option value="Satılık">Satılık</option>
                <option value="Kiralık">Kiralık</option>
                <option value="Arsa">Arsa</option>
                <option value="İş Yeri">İş Yeri</option>
              </select>
            </div>
            
            <div>
              <label>Oda</label>
              <select value={form.rooms} onChange={(e) => update('rooms', e.target.value)}>
                <option value="1+1">1+1</option>
                <option value="2+1">2+1</option>
                <option value="3+1">3+1</option>
                <option value="4+1">4+1</option>
                <option value="5+1">5+1</option>
                <option value="-">-</option>
              </select>
            </div>
            
            <div>
              <label>m²</label>
              <input
                type="number"
                value={form.area}
                onChange={(e) => update('area', e.target.value)}
              />
            </div>
            
            <div>
              <label>Banyo</label>
              <input
                type="number"
                value={form.bath}
                onChange={(e) => update('bath', e.target.value)}
              />
            </div>
            
            <div>
              <label>Telefon</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
              />
            </div>
            
            <div className="full">
              <label>Resim URL</label>
              <input
                type="text"
                value={form.img}
                onChange={(e) => update('img', e.target.value)}
                placeholder="https://..."
              />
            </div>
            
            <div className="full">
              <label>Açıklama</label>
              <textarea
                value={form.desc}
                onChange={(e) => update('desc', e.target.value)}
              />
            </div>
          </div>
          
          <div className="modal-actions">
            <button 
              className="btn-primary" 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? '⏳...' : '💾 Kaydet'}
            </button>
            <button className="btn-secondary" onClick={onClose}>İptal</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddListingModal
