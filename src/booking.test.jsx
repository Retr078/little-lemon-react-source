import React from 'react';
import {describe,it,expect,beforeEach,afterEach,vi} from 'vitest';
import {render,screen,fireEvent,cleanup} from '@testing-library/react';
import {BookingForm,BookingPage} from './main';
import {validate,dateToday,maxDate,availableTimes,saveBooking,readBookings,initializeTimes,updateTimes} from './booking';
beforeEach(()=>{localStorage.clear();vi.useFakeTimers();vi.setSystemTime(new Date('2026-10-30T15:00:00Z'));});
afterEach(()=>{cleanup();vi.useRealTimers();});
const valid=()=>({date:dateToday(),time:'18:00',guests:2,seating:'Dining room',name:'Alex Morgan',email:'alex@example.com',phone:'',requests:'',consent:true});
describe('reservation validation',()=>{
 it('accepts a valid booking',()=>expect(validate(valid(),2)).toEqual({}));
 it('rejects past dates and dates beyond the booking window',()=>{expect(validate({...valid(),date:'2020-01-01'},1).date).toBeTruthy();expect(validate({...valid(),date:'2099-12-31'},1).date).toBeTruthy();expect(maxDate()).toBe('2027-01-28');});
 it('rejects missing and invalid times',()=>{expect(validate({...valid(),time:''},1).time).toBeTruthy();expect(validate({...valid(),time:'23:00'},1).time).toBeTruthy();});
 it.each([0,9,1.5,'abc'])('rejects invalid guest count %s',guests=>expect(validate({...valid(),guests},1).guests).toBeTruthy());
 it('rejects invalid contact details and missing acknowledgment',()=>{const e=validate({...valid(),name:'A',email:'invalid',phone:'abc',consent:false},2);expect(Object.keys(e)).toEqual(expect.arrayContaining(['name','email','phone','consent']));});
 it('excludes elapsed seatings in Chicago time',()=>{vi.setSystemTime(new Date('2026-10-31T01:15:00Z'));expect(availableTimes(dateToday())).not.toContain('20:00');expect(availableTimes(dateToday())).toContain('20:30');});
 it('prevents duplicate slots and persists reservations',()=>{saveBooking({...valid(),id:'ABC123'});expect(readBookings()).toHaveLength(1);expect(availableTimes(dateToday(),readBookings())).not.toContain('18:00');expect(()=>saveBooking({...valid(),id:'DEF456'})).toThrow(/just booked/);});
 it('initializes and updates available times for the parent reducer',()=>{expect(initializeTimes()).toEqual(availableTimes(dateToday()));saveBooking({...valid(),date:'2026-11-05',id:'ABC123'});expect(updateTimes([],{date:'2026-11-05'})).not.toContain('18:00');expect(updateTimes([],{date:'2026-11-06'})).toContain('18:00');});
 it('recovers from corrupt storage',()=>{localStorage.setItem('little-lemon-bookings','invalid JSON');expect(readBookings()).toEqual([]);});
});
describe('booking form',()=>{
 it('announces a missing time and stays on the first step',()=>{render(<BookingPage/>);fireEvent.click(screen.getByRole('button',{name:/Continue to your details/}));expect(screen.getByText('Choose an available seating time.')).toBeInTheDocument();expect(screen.queryByLabelText('Full name')).not.toBeInTheDocument();});
 it('completes both steps and shows the reservation confirmation',()=>{render(<BookingPage/>);fireEvent.click(screen.getByRole('button',{name:'6:00 PM'}));fireEvent.click(screen.getByRole('button',{name:/Continue to your details/}));fireEvent.change(screen.getByLabelText('Full name'),{target:{value:'Alex Morgan'}});fireEvent.change(screen.getByLabelText('Email address'),{target:{value:'alex@example.com'}});fireEvent.click(screen.getByRole('checkbox'));fireEvent.click(screen.getByRole('button',{name:/Confirm reservation/}));expect(screen.getByText(/Your demo table is reserved, Alex/)).toBeInTheDocument();expect(readBookings()).toHaveLength(1);});
 it('retains selections when returning to the table step',()=>{render(<BookingPage/>);fireEvent.click(screen.getByRole('button',{name:'6:00 PM'}));fireEvent.click(screen.getByRole('button',{name:/Continue to your details/}));fireEvent.click(screen.getByRole('button',{name:'Edit'}));expect(screen.getByRole('button',{name:'6:00 PM'})).toHaveAttribute('aria-pressed','true');});
 it('renders times from props and dispatches the selected date to the parent',()=>{const dispatch=vi.fn();render(<BookingForm availableTimes={['19:00']} dispatch={dispatch}/>);expect(screen.getByRole('button',{name:'7:00 PM'})).toBeInTheDocument();expect(screen.queryByRole('button',{name:'6:00 PM'})).not.toBeInTheDocument();fireEvent.change(screen.getByLabelText(/Date/),{target:{value:'2026-11-05'}});expect(dispatch).toHaveBeenLastCalledWith({date:'2026-11-05'});});
});
