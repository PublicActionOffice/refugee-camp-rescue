'use strict';
const initialState = () => ({budget:100,water:50,tents:10,injured:5,trust:40,food:0,sanitation:0,step:0,history:[],pending:false});
const scenarios = [
 {time:'08:00',label:'国境からの緊急連絡',message:'「大変です！100人が国境を越えて到着しました。子どもが35人、高齢者が15人、けが人も5人います！ テントは10張り、水は50人分しかありません。」',question:'あなたは、何を最優先にしますか？',hint:'まず1つを実行します。残る課題には、その後の判断で対応できます。',choices:[
 ['医療チームを派遣する',20,'負傷者5人の治療を開始。水と住居の不足は残ります。',{injured:-5,trust:5},'5人の治療を開始し、必要な処置につなげました。水と住居の確保も急ぐ必要があります。'],
 ['安全な水を緊急調達する',15,'水を50人分追加し、100人分を確保。',{water:50,trust:3},'到着した100人に配る水を確保しました。負傷者の対応と夜を過ごせる場所は、まだ必要です。'],
 ['テントを10張り追加する',25,'1張り5人の想定で、全員の寝場所を確保。',{tents:10,trust:3},'追加のテントを確保しました。雨風を避けられますが、医療と水への対応も必要です。'],
 ['住民と一緒に必要な支援を確認する',5,'通訳を手配し、困りごとと支援の優先度を把握。',{trust:20},'住民の声から、移動が難しい人や離ればなれの家族を把握できました。対話だけでは物資不足を解消できないため、次の手配が重要です。'] ]},
 {time:'10:00',label:'支援物資の到着',message:'「物資車両がキャンプに向かえます。水を優先するか、テントを積むか、両方を手配するか。午前のうちに判断が必要です。」',question:'次の便で、何を届けますか？',hint:'現在の水とテントの数を見て、足りないものを補いましょう。',choices:[
 ['水とテントをまとめて手配',35,'水50人分とテント10張りを追加。',{water:50,tents:10},'水と寝場所の両方を増やしました。まとめた輸送で費用を抑えられました。'],
 ['給水タンクを手配',15,'水50人分を追加。',{water:50},'給水地点を設けました。水は配りやすくなりましたが、足の不自由な人への届け方も考える必要があります。'],
 ['テントを10張り手配',25,'寝場所を50人分追加。',{tents:10},'テント10張りを追加しました。世帯が一緒に過ごせるよう、住民と配置を相談します。'],
 ['既存の物資を住民と再配分',0,'信頼が5上昇。物資の総量は増えません。',{trust:5},'偏りを見直し、配布の手順を共有しました。ただし、足りない水やテントの量は変わりません。'] ]},
 {time:'12:00',label:'診療所からの報告',message:'「診療担当から連絡です。負傷者の対応に加え、衛生設備の不足が気になります。今なら医療と衛生の合同チームを呼べます。」',question:'健康を守るため、どう動きますか？',hint:'治療が必要な人の数は、画面上部に表示されています。',choices:[
 ['医療・衛生の合同チームを派遣',25,'未対応の負傷者を治療し、衛生設備を整備。',{injured:-5,sanitation:1},'未対応の負傷者を診療につなぎ、手洗い場所と仮設トイレを整えました。'],
 ['医療チームを派遣',20,'未対応の負傷者5人までを治療。',{injured:-5},'診療を実施しました。すでに全員が治療済みの場合、追加の数値効果はありません。'],
 ['衛生設備を整備',10,'手洗い場所と仮設トイレを設置。',{sanitation:1},'衛生設備を設けました。利用しやすい場所やプライバシーについて住民と確認します。'],
 ['現地スタッフと支援状況を確認',0,'信頼が5上昇。治療と設備整備は未実施。',{trust:5},'必要な支援を記録しました。診療や衛生設備の代わりにはならず、未対応の課題は残ります。'] ]},
 {time:'15:00',label:'最初の食事',message:'「到着してから、十分な食事をとれていない人がいます。住民から、一緒に炊き出しを運営したいという声が上がりました。」',question:'食事の支援をどう組み立てますか？',hint:'食事はこの場面で確保します。住民との協働には調整の費用も含まれます。',choices:[
 ['住民と共同で炊き出しを実施',20,'100人分の食事を確保。信頼が15上昇。',{food:100,trust:15},'住民と調理・配布の役割を決め、100人分の食事を用意しました。食べられない食材や個別の事情も聞き取りました。'],
 ['100人分の食事を購入',15,'全員の食事を確保。',{food:100},'100人分の食事を確保しました。列に並べない人にも届くよう、スタッフが配布します。'],
 ['50人分の食事を購入',8,'食事を50人分確保。50人分は不足。',{food:50},'50人分を確保しました。必要度を確認して配布しますが、全員には行き渡りません。'],
 ['外部団体に応援を要請',0,'到着は翌日の予定。今日の食事は増えません。',{},'応援を要請しましたが、届くのは翌日の予定です。今日の食事不足は解消していません。'] ]},
 {time:'18:00',label:'夜を迎える準備',message:'「暗くなる前に、最後の物資便を出せます。足りない水や寝場所を確認してください。家族を探している子どももいて、安心して相談できる窓口が求められています。」',question:'残りの予算を、どこへ回しますか？',hint:'物資の補充ができる最後の機会です。水は初日の配布量の累計で表示しています。',choices:[
 ['水とテントを追加手配',35,'水50人分とテント10張りを追加。',{water:50,tents:10},'夕方の便で水とテントを追加しました。物資だけでなく、困りごとを伝えられる体制も大切です。'],
 ['水を50人分追加',15,'水の不足を補います。',{water:50},'追加の水が到着しました。配布から取り残される人がいないか確認します。'],
 ['テントを10張り追加',25,'寝場所を50人分追加。',{tents:10},'夜までにテントを追加しました。家族構成や安全面に配慮して案内します。'],
 ['住民と相談窓口を設置',5,'信頼が20上昇。通訳と家族の再会支援を手配。',{trust:20},'安心して相談できる窓口を設けました。家族の再会支援は、個人情報を守りながら進めます。'],
 ['スタッフで夜間の連絡体制を確認',0,'信頼が5上昇。物資の追加はありません。',{trust:5},'夜間に困ったときの連絡先を共有しました。未解決の物資不足は翌日への課題になります。'] ]},
 {time:'21:00',label:'初日の引き継ぎ',message:'「長い一日が終わります。明日のチームへ引き継ぎましょう。残っている健康の課題に対応するか、住民と明日の計画をつくるか、最後の判断です。」',question:'明日につなぐ、最後の行動は？',hint:'残金だけでなく、何を確保できて何が残ったかで振り返ります。',choices:[
 ['医療・衛生の合同チームを手配',25,'未対応の負傷者を治療し、衛生設備を整備。',{injured:-5,sanitation:1},'夜間チームが未対応の診療と衛生設備の整備を引き受けました。'],
 ['夜間の医療チームを手配',20,'未対応の負傷者5人までを治療。',{injured:-5},'夜間の診療につなげました。翌日の継続的な診療体制も引き継ぎます。'],
 ['衛生設備を整備',10,'手洗い場所と仮設トイレを設置。',{sanitation:1},'衛生設備を整え、清掃と維持管理の担当を確認しました。'],
 ['住民と翌日の支援計画をつくる',0,'信頼が10上昇。未解決の物資・治療不足は残ります。',{trust:10},'住民と困りごとを整理し、次のチームへ引き継ぎました。計画を立てても、今日の未対応の課題は残ります。'] ]}
];
let state=initialState();
function applyChoice(current,choice){if(current.pending||current.step>=scenarios.length||choice[1]>current.budget)return null;const next={...current,history:[...current.history],budget:current.budget-choice[1],pending:true};for(const [key,value] of Object.entries(choice[3]))next[key]+=value;next.injured=Math.max(0,next.injured);next.trust=Math.min(100,next.trust);next.sanitation=Math.min(1,next.sanitation);next.history.push({time:scenarios[current.step].time,title:choice[0],cost:choice[1],feedback:choice[4]});return next;}
function summary(s){return [{ok:s.injured===0,text:s.injured===0?'5人全員を治療につなげました。':`${s.injured}人の負傷者が未対応です。医療への接続が急がれます。`},{ok:s.water>=100,text:s.water>=100?'初日の水を100人分以上確保できました。':`水が${100-s.water}人分不足しています。継続的な給水も必要です。`},{ok:s.tents>=20,text:s.tents>=20?'全員の寝場所を確保できました。':`${100-s.tents*5}人分の寝場所が不足しています。`},{ok:s.food>=100,text:s.food>=100?'全員の初日の食事を確保できました。':`食事が${100-s.food}人分不足しています。`},{ok:s.sanitation>0,text:s.sanitation?'衛生設備を整備できました。維持管理も続けましょう。':'衛生設備の整備が残っています。'},{ok:s.trust>=60,text:s.trust>=60?'住民の声を支援に取り入れる機会をつくれました。':'住民の声を聞き、計画に参加してもらう機会を増やしましょう。'}];}
function render(){const stage=scenarios[state.step];document.getElementById('dashboard').innerHTML=[['残りの予算',state.budget,'万円','初期予算 100万円',false],['確保した水',state.water,'人分','初日の目標 100人分',state.water<100],['テント',state.tents,'張り',`収容 ${state.tents*5}人 / 100人`,state.tents<20],['未対応の負傷者',state.injured,'人','到着時 5人',state.injured>0]].map(([label,value,unit,detail,warn])=>`<div class="stat ${warn?'warn':''}"><span class="label">${label}</span><strong>${value}<small>${unit}</small></strong><span class="detail">${detail}</span></div>`).join('');document.getElementById('log').innerHTML='<li>08:00 現地スタッフから緊急連絡</li>'+state.history.map(x=>`<li>${x.time} ${x.title}<br>支出 ${x.cost}万円</li>`).join('');const mission=document.getElementById('mission');if(!stage){const items=summary(state);const ready=items.every(x=>x.ok);mission.innerHTML=`<div class="result"><p class="eyebrow">DAY 01 / 振り返り</p><h2>${ready?'明日につながる支援を。':'今日の判断を、明日の支援へ。'}</h2><p>6つの判断を終えました。支出は<strong>${100-state.budget}万円</strong>、残りは<strong>${state.budget}万円</strong>です。</p><ul>${items.map(x=>`<li><strong>${x.ok?'確保・対応済み':'引き継ぎが必要'}</strong><br>${x.text}</li>`).join('')}</ul><p class="hint">これが唯一の正解ではありません。最初の行動を変えたら、何が変わるでしょうか。現実では、複数の支援を並行して進め、現地の状況を継続的に確かめます。</p><button class="primary" id="again">別の判断で、もう一度</button></div>`;document.getElementById('again').onclick=restart;return;}const top=`<div class="stage-line"><span class="time">${stage.time}</span><span class="stage-name">DAY 01 · ${state.step+1} / 6</span><div class="progress" aria-hidden="true">${scenarios.map((_,i)=>`<i class="${i<=state.step?'on':''}"></i>`).join('')}</div></div>`;if(state.pending){const last=state.history.at(-1);mission.innerHTML=top+`<div class="feedback"><p class="eyebrow">ACTION REPORT</p><h2>${last.title}</h2><p>${last.feedback}</p><p>今回の支出：${last.cost}万円 ／ 残り：${state.budget}万円</p><button class="primary" id="next">${state.step===5?'初日の振り返りへ':'次の状況へ →'}</button></div>`;document.getElementById('next').onclick=()=>{state.pending=false;state.step++;render();focusMission();};return;}mission.innerHTML=top+`<div class="radio"><p class="eyebrow">● 無線連絡 / ${stage.label}</p><p>${stage.message}</p></div><h2 class="question">${stage.question}</h2><p class="hint">${stage.hint}</p><div class="choices">${stage.choices.map((c,i)=>`<button class="choice" data-choice="${i}" ${c[1]>state.budget?'disabled':''}><span class="letter">${String.fromCharCode(65+i)}</span><span class="choice-body"><strong>${c[0]}</strong><p>${c[2]}</p></span><span class="cost">${c[1]}万円<small>${c[1]>state.budget?'予算不足':'必要予算'}</small></span></button>`).join('')}</div>`;mission.querySelectorAll('[data-choice]').forEach(button=>button.onclick=()=>{const next=applyChoice(state,stage.choices[Number(button.dataset.choice)]);if(next){state=next;render();focusMission();}});}
function focusMission(){const el=document.getElementById('mission');el.tabIndex=-1;el.focus({preventScroll:true});if(window.matchMedia('(max-width:760px)').matches)el.scrollIntoView({behavior:'smooth',block:'start'});}
function restart(){if(state.history.length&&state.step<6&&!window.confirm('現在の進行をリセットして、最初から始めますか？'))return;state=initialState();render();focusMission();}
if(typeof document!=='undefined'){document.getElementById('reset').onclick=restart;render();}
if(typeof module!=='undefined')module.exports={initialState,scenarios,applyChoice,summary};
