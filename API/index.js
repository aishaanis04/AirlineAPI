const express = require('express');
const {Pool, Connection} = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
 connectionString: process.env.DATABASE_URL,
 ssl : {
    rejectUnauthorized : false
 }
});

app.get('/',(req,res) => {
    try{
        res.json({message: 'WELCOME>>>>!'});
    }catch(err){
        res.status(500).json({error : err.message});
    }
});
//....................flight..............................
app.get('/flights',async(req,res)=>{
    try{
        const result = await pool.query('select * from flight')
        res.json(result.rows);
    }catch(err){
        res.status(500).json({error : err.message});
    }
});
app.post('/flights', async (req, res) => {
  try {
    const { airline_id, departure_time, arrival_time, status } = req.body;
    const r = await pool.query(
      'INSERT INTO flight(airline_id, departure_time, arrival_time, status) VALUES($1, $2, $3, $4) RETURNING *',
      [airline_id, departure_time, arrival_time, status]
    );
    res.json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/flights/:id', async (req, res) => {
  try {
    const { airline_id, departure_time, arrival_time, status } = req.body;
    const r = await pool.query(
      'UPDATE flight SET airline_id=$1, departure_time=$2, arrival_time=$3, status=$4 WHERE flight_id=$5 RETURNING *',
      [airline_id, departure_time, arrival_time, status, req.params.id]
    );
    res.json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/flights/:id', async (req, res) => {
  try {
    const r = await pool.query('DELETE FROM flight WHERE flight_id = $1 RETURNING *', [req.params.id]);
    res.json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
//........................Aircraft.................................
app.get('/aircraft',async(req,res)=>{
    try{
        const result = await pool.query('select * from aircraft')
        res.json(result.rows);
    }catch(err){
        res.status(500).json({error : err.message});
    }
});
//........................Airport.................................
app.get('/airport',async(req,res)=>{
    try{
        const result = await pool.query('select * from airport')
        res.json(result.rows);
    }catch(err){
        res.status(500).json({error : err.message});
    }
});
//........................Airline.................................
app.get('/airline',async(req,res)=>{
    try{
        const result = await pool.query('select * from airline')
        res.json(result.rows);
    }catch(err){
        res.status(500).json({error : err.message});
    }
});
app.post('/airline', async (req, res) => {
  try {
    const r = await pool.query('INSERT INTO airline(airline_name) VALUES($1) RETURNING *', [req.body.airline_name]);
    res.json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/airline/:id', async (req, res) => {
  try {
    const r = await pool.query('UPDATE airline SET airline_name=$1 WHERE airline_id=$2 RETURNING *', [req.body.airline_name, req.params.id]);
    res.json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/airline/:id', async (req, res) => {
  try {
    const r = await pool.query('DELETE FROM airline WHERE airline_id = $1 RETURNING *', [req.params.id]);
    res.json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

const endpoints = ['aircraft', 'airport', 'baggage', 'crew', 'maintenance', 'payment', 'pilot', 'reservation', 'route', 'schedule', 'staff', 'details'];
endpoints.forEach(route => {
  app.get(`/${route}`, async (req, res) => {
    try { const result = await pool.query(`SELECT * FROM ${route}`); res.json(result.rows); } 
    catch (err) { res.status(500).json({ error: err.message }); }
  });
});
//........................Baggage.................................
app.get('/baggage',async(req,res)=>{
    try{
        const result = await pool.query('select * from baggage')
        res.json(result.rows);
    }catch(err){
        res.status(500).json({error : err.message});
    }
});
//........................Booking.................................
app.get('/booking',async(req,res)=>{
    try{
        const result = await pool.query('select * from booking')
        res.json(result.rows);
    }catch(err){
        res.status(500).json({error : err.message});
    }
});
//........................Crew.................................
app.get('/crew',async(req,res)=>{
    try{
        const result = await pool.query('select * from crew')
        res.json(result.rows);
    }catch(err){
        res.status(500).json({error : err.message});
    }
});
//........................Maintenance.................................
app.get('/maintenance',async(req,res)=>{
    try{
        const result = await pool.query('select * from maintenance')
        res.json(result.rows);
    }catch(err){
        res.status(500).json({error : err.message});
    }
});
//........................Passenger.................................
app.get('/passenger',async(req,res)=>{
    try{
        const result = await pool.query('select * from passenger')
        res.json(result.rows);
    }catch(err){
        res.status(500).json({error : err.message});
    }
});
app.get('/passenger', async (req, res) => {
  try { const r = await pool.query('SELECT * FROM passenger ORDER BY passenger_id DESC'); res.json(r.rows); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/passenger', async (req, res) => {
  try {
    const { name, nationality, phone, email, passport_id } = req.body;
    const r = await pool.query(
      'INSERT INTO passenger(name, nationality, phone, email, passport_id) VALUES($1, $2, $3, $4, $5) RETURNING *',
      [name, nationality, phone, email, passport_id]
    );
    res.json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/passenger/:id', async (req, res) => {
  try {
    const { name, nationality, phone, email, passport_id } = req.body;
    const r = await pool.query(
      'UPDATE passenger SET name=$1, nationality=$2, phone=$3, email=$4, passport_id=$5 WHERE passenger_id=$6 RETURNING *',
      [name, nationality, phone, email, passport_id, req.params.id]
    );
    res.json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/passenger/:id', async (req, res) => {
  try {
    const r = await pool.query('DELETE FROM passenger WHERE passenger_id = $1 RETURNING *', [req.params.id]);
    res.json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

//........................Payment.................................
app.get('/payment',async(req,res)=>{
    try{
        const result = await pool.query('select * from payment')
        res.json(result.rows);
    }catch(err){
        res.status(500).json({error : err.message});
    }
});
//........................Pilot.................................
app.get('/pilot',async(req,res)=>{
    try{
        const result = await pool.query('select * from pilot')
        res.json(result.rows);
    }catch(err){
        res.status(500).json({error : err.message});
    }
});
//........................Reservation.................................
app.get('/reservation',async(req,res)=>{
    try{
        const result = await pool.query('select * from reservation')
        res.json(result.rows);
    }catch(err){
        res.status(500).json({error : err.message});
    }
});
//........................Route.................................
app.get('/route',async(req,res)=>{
    try{
        const result = await pool.query('select * from route')
        res.json(result.rows);
    }catch(err){
        res.status(500).json({error : err.message});
    }
});
//........................Schedule.................................
app.get('/schedule',async(req,res)=>{
    try{
        const result = await pool.query('select * from schedule')
        res.json(result.rows);
    }catch(err){
        res.status(500).json({error : err.message});
    }
});
//........................Ticket.................................
app.get('/ticket',async(req,res)=>{
    try{
        const result = await pool.query('select * from ticket')
        res.json(result.rows);
    }catch(err){
        res.status(500).json({error : err.message});
    }
});
app.post('/ticket', async (req, res) => {
  try {
    const { seat_no, class: ticketClass, price, passenger_id, flight_id, reservation_id } = req.body;
    const r = await pool.query(
      'INSERT INTO ticket(seat_no, class, price, passenger_id, flight_id, reservation_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
      [seat_no, ticketClass, price, passenger_id, flight_id, reservation_id]
    );
    res.json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/ticket/:id', async (req, res) => {
  try {
    const { seat_no, class: ticketClass, price, passenger_id, flight_id, reservation_id } = req.body;
    const r = await pool.query(
      'UPDATE ticket SET seat_no=$1, class=$2, price=$3, passenger_id=$4, flight_id=$5, reservation_id=$6 WHERE ticket_id=$7 RETURNING *',
      [seat_no, ticketClass, price, passenger_id, flight_id, reservation_id, req.params.id]
    );
    res.json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/ticket/:id', async (req, res) => {
  try {
    const r = await pool.query('DELETE FROM ticket WHERE ticket_id = $1 RETURNING *', [req.params.id]);
    res.json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
//........................Staff.................................
app.get('/staff',async(req,res)=>{
    try{
        const result = await pool.query('select * from staff')
        res.json(result.rows);
    }catch(err){
        res.status(500).json({error : err.message});
    }
});
//........................Detais.................................
app.get('/details',async(req,res)=>{
    try{
        const result = await pool.query('select * from details')
        res.json(result.rows);
    }catch(err){
        res.status(500).json({error : err.message});
    }
});

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});

const API_ENDPOINT = "https://fictional-space-fishstick-v6xgj6w979wq269wr-3000.app.github.dev";