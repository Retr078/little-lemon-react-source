export const TIMES = ['17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00'];
export const dateToday = () => new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
export function maxDate(){const d=new Date(dateToday()+'T12:00:00');d.setDate(d.getDate()+90);return d.toISOString().slice(0,10);}
export function availableTimes(date, bookings=[], now=new Date()) {
 const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'America/Chicago',hour:'2-digit',minute:'2-digit',hour12:false}).format(now);
 return TIMES.filter(t=>(date!==dateToday()||t>parts)&&!bookings.some(b=>b.date===date&&b.time===t));
}
// Reducer pair for the parent that owns available times (useReducer(updateTimes, undefined, initializeTimes)).
export const initializeTimes = () => availableTimes(dateToday(), readBookings());
export const updateTimes = (state, action) => availableTimes(action.date, readBookings());
export function validate(values, step, bookings=[]){
 const e={};
 if(!/^\d{4}-\d{2}-\d{2}$/.test(values.date)||values.date<dateToday()||values.date>maxDate()) e.date='Choose a date from today through the next 90 days.';
 if(!Number.isInteger(Number(values.guests))||values.guests<1||values.guests>8)e.guests='Choose between 1 and 8 guests.';
 if(!availableTimes(values.date,bookings).includes(values.time))e.time='Choose an available seating time.';
 if(!['Dining room','Patio'].includes(values.seating))e.seating='Choose a seating preference.';
 if(step===2){
 if(values.name.trim().length<2||values.name.trim().length>80)e.name='Enter your full name (2–80 characters).';
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)||values.email.length>254)e.email='Enter a valid email address, like alex@example.com.';
 if(values.phone && !/^\+?[\d ()-]{7,24}$/.test(values.phone))e.phone='Enter a valid phone number or leave this optional field blank.';
 if(values.requests.length>500)e.requests='Keep special requests under 500 characters.';
 if(!values.consent)e.consent='Please acknowledge that this is a demo reservation.';
 }return e;
}
export function readBookings(){try{const v=JSON.parse(localStorage.getItem('little-lemon-bookings')||'[]');return Array.isArray(v)?v.filter(b=>b&&typeof b.id==='string'&&typeof b.date==='string'&&TIMES.includes(b.time)):[];}catch{return [];}}
export function saveBooking(booking){const all=readBookings();if(all.some(b=>b.date===booking.date&&b.time===booking.time))throw new Error('That time was just booked. Please choose another time.');localStorage.setItem('little-lemon-bookings',JSON.stringify([...all,booking]));}
export const prettyDate = date => new Date(date+'T12:00:00').toLocaleDateString('en-US',{weekday:'short',month:'long',day:'numeric'});
export const prettyTime = time => {const [h,m]=time.split(':');return `${Number(h)%12||12}:${m} ${Number(h)>=12?'PM':'AM'}`;};
