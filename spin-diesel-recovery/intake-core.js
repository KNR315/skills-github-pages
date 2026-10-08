'use strict';
(function(root){
const PACE=['Gentle','Easy','Comfortable'];
const SCENTS = [
    ['lavender', 'Lavender', 'Floral'], ['jasmine', 'Jasmine', 'Floral'],
    ['ylang_ylang', 'Ylang Ylang', 'Floral'], ['rose', 'Rose', 'Floral'],
    ['geranium', 'Geranium', 'Floral'], ['chamomile', 'Chamomile', 'Floral'],
    ['sweet_orange', 'Sweet Orange', 'Citrus & grassy'], ['bergamot', 'Bergamot', 'Citrus & grassy'],
    ['lemongrass', 'Lemongrass', 'Citrus & grassy'], ['citronella', 'Citronella', 'Citrus & grassy'],
    ['sandalwood', 'Sandalwood', 'Woody & earthy'], ['frankincense', 'Frankincense', 'Woody & earthy'],
    ['patchouli', 'Patchouli', 'Woody & earthy'], ['peppermint', 'Peppermint', 'Fresh & herbal'],
    ['eucalyptus', 'Eucalyptus', 'Fresh & herbal'], ['tea_tree', 'Tea Tree', 'Fresh & herbal'],
    ['rosemary', 'Rosemary', 'Fresh & herbal'], ['clary_sage', 'Clary Sage', 'Fresh & herbal'],
    ['vanilla', 'Vanilla', 'Sweet & spicy'], ['cinnamon', 'Cinnamon', 'Sweet & spicy']
  ].map(([id, name, family]) => ({ id, name, family }));
function scentChoices(values){const fragranceFree=values.scent!=='Explore scent preferences';return Object.fromEntries(SCENTS.map(({id})=>{const s=values.scentMap?.[id];return [id,['interested','discuss','avoid'].includes(s)&&(!fragranceFree||s==='avoid')?s:'neutral'];}));}
function validate(v){const errors=[];if(!['30','90'].includes(v.length))errors.push({message:'Choose 30 or 90 minutes.'});if(!['upper','lower','whole'].includes(v.theme))errors.push({message:'Choose an exploration theme.'});if(![1,2,3].includes(Number(v.effort)))errors.push({message:'Choose a comfortable pace.'});return errors;}
function routine(length,theme){
 const upper=['Shoulders & grip','Easy shoulder circles, a short wall slide, wrist circles, and relaxed hand opening. No loaded or forced movement.'];
 const lower=['Hips & legs','Easy ankle circles, comfortable seated knee extension, and a small supported standing hip movement. No forced end range.'];
 const whole=['Whole-body ease','Alternate comfortable shoulder, wrist, ankle, and hip movements. Choose fewer movements when tired.'];
 const target={upper,lower,whole}[theme]||whole;
 const steps=length==='90'?[['Settle',5,'Notice your energy; select one easy movement to revisit.'],['Warm-up',10,'Easy walking or marching; shorten this if needed.'],[target[0],15,target[1]],['Supported rest',10,'Sit or lie comfortably; breathe normally.'],['Optional second exploration',15,'Repeat only comfortable movements or spend this block resting.'],['Gentle mobility',10,'Brief, unforced stretches if comfortable, with breaks.'],['Rest again',15,'No continuous stretching target. Rest is part of the outline.'],['Revisit & close',10,'Repeat the easy movement gently, then choose one small next step.']]:[['Settle',3,'Notice your energy; select one easy movement to revisit.'],['Warm-up',5,'Easy walking or marching.'],[target[0],10,target[1]],['Gentle mobility',7,'If comfortable, try brief unforced stretches, resting between them.'],['Revisit & rest',5,'Repeat your easy movement without forcing range, then rest.']];
 return {title:`${length}-minute ${target[0].toLowerCase()} outline`,note:'General education for healthy adults. Shorten or skip freely. Pain, dizziness, tingling, numbness or unusual weakness means stop. The body map records intentions; it does not alter or prescribe the outline.',steps:steps.map(([label,minutes,detail])=>({label,minutes,detail}))};
}
function buildData(v,zones,now=new Date()){
 const clean=(s,n)=>String(s||'').trim().slice(0,n);
 const noScent=v.scent!=='Explore scent preferences';
 const bodyMap=Object.fromEntries(Object.entries(zones).filter(([k,s])=>/^[a-z_]+$/.test(k)&&['focus','include','ask','skip'].includes(s)));
 return {meta:{schemaVersion:5,mode:'educational-local-only',createdAt:now.toISOString(),status:'local-plan'},plan:{minutes:Number(v.length),theme:v.theme,pace:PACE[Number(v.effort)-1],bodyMap,notes:clean(v.bodyRequests,1000)},atmosphere:{choices:(Array.isArray(v.style)?v.style:[]).filter(s=>['No preference','Quiet','Soft music','No music','Nature sounds','Personal playlist','Extra pauses'].includes(s)),notes:clean(v.atmosphereNotes,500),scent:noScent?'No added fragrance':'Explore scent preferences',scentMap:scentChoices(v),scentIntensity:noScent?'None':(['Light','Medium','Strong'].includes(v.scentIntensity)?v.scentIntensity:'Light')},outline:routine(v.length,v.theme)};
}
function summary(d,names){const mapLabels={focus:'Focus',include:'Include',ask:'Learn more',skip:'Skip'};const lines=[`Time: ${d.plan.minutes} minutes`,`Theme: ${d.outline.title}`,`Pace: ${d.plan.pace}`,`Planning notes: ${d.plan.notes||'None'}`,`Atmosphere: ${d.atmosphere.choices.join(', ')||'No preference'}`,`Atmosphere notes: ${d.atmosphere.notes||'None'}`,`Scent: ${d.atmosphere.scent}`,`Intensity preference: ${d.atmosphere.scentIntensity}`];for(const [s,label]of Object.entries(mapLabels))lines.push(`${label}: ${Object.entries(d.plan.bodyMap).filter(([,v])=>v===s).map(([id])=>names[id]||id).join(', ')||'None'}`);for(const s of ['interested','discuss','avoid'])lines.push(`${{interested:'Scent interests',discuss:'Explore later',avoid:'Avoid'}[s]}: ${SCENTS.filter(x=>d.atmosphere.scentMap[x.id]===s).map(x=>x.name).join(', ')||'None'}`);return lines.join('\n');}
const api={PACE,SCENTS,scentChoices,validate,routine,buildData,summary};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.RecoveryIntake=api;
})(globalThis);
