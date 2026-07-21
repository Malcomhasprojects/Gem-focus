'use server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { campaignEvents, campaignMetrics, issues } from '@/lib/db/schema'
import { clearAdminCookie, isAdmin, setAdminCookie, validKey } from '@/lib/admin-auth'
export async function unlockAdmin(form:FormData){const key=String(form.get('key')||'');if(!validKey(key))return {ok:false,message:'Incorrect access key.'};await setAdminCookie();return {ok:true,message:'Unlocked'} }
export async function logoutAdmin(){await clearAdminCookie();revalidatePath('/admin')}
