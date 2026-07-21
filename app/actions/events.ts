'use server'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { isAdmin } from '@/lib/admin-auth'
import { db } from '@/lib/db'
import { campaignEvents } from '@/lib/db/schema'
const t=(f:FormData,k:string)=>String(f.get(k)||'').trim()
export async function saveEvent(form:FormData){if(!await isAdmin())throw new Error('Unauthorized');const id=Number(form.get('id'));const values={title:t(form,'title'),ward:t(form,'ward'),venue:t(form,'venue'),eventDate:t(form,'eventDate'),eventTime:t(form,'eventTime'),objective:t(form,'objective'),status:t(form,'status')||'scheduled',attendance:Number(form.get('attendance'))||null,expectedAttendance:Number(form.get('expectedAttendance'))||null,updatedAt:new Date()};if(!values.title||!values.ward||!values.venue||!values.eventDate||!values.eventTime)throw new Error('Complete all required fields.');if(id)await db.update(campaignEvents).set(values).where(eq(campaignEvents.id,id));else await db.insert(campaignEvents).values(values);revalidatePath('/events');revalidatePath('/admin')}
export async function deleteEvent(id:number){if(!await isAdmin())throw new Error('Unauthorized');await db.delete(campaignEvents).where(eq(campaignEvents.id,id));revalidatePath('/events');revalidatePath('/admin')}
