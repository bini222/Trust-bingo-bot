const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// የተጠቃሚዎችን መረጃ ለጊዜው በማህደረ ትውስታ እናስቀምጥ (በኋላ ዳታቤዝ እንጠቀማለን)
const users = {}; 

bot.start((ctx) => {
    const userId = ctx.from.id;
    
    // አዲስ ተጠቃሚ ከሆነ መዝግበው 100 ብር ስጠው
    if (!users[userId]) {
        users[userId] = {
            id: userId,
            name: ctx.from.first_name,
            balance: 100, // የምዝገባ ቦነስ
            spinsToday: 0
        };
        ctx.reply(`እንኳን ወደ Trust Bingo በደህና መጣህ ${ctx.from.first_name}! 🎉\n\nበምዝገባ ስጦታ 100 ብር አግኝተሃል።\n\nያለህ ባላንስ፦ ${users[userId].balance} ብር`);
    } else {
        ctx.reply(`እንኳን ደግመህ መጣህ ${ctx.from.first_name}! 👋\n\nያለህ ባላንስ፦ ${users[userId].balance} ብር`);
    }

    // ዋና ምናሌ አሳይ
    ctx.reply('ምን ማድረግ ትፈልጋለህ?', {
        reply_markup: {
            keyboard: [
                [{ text: '🎰 ስፒን አድርግ (Spin)' }],
                [{ text: '💰 ባላንስ (Balance)' }, { text: '💸 ገንዘብ አውጣ (Withdraw)' }]
            ],
            resize_keyboard: true
        }
    });
});

// የባላንስ ማሳያ
bot.hears('💰 ባላንስ (Balance)', (ctx) => {
    const userId = ctx.from.id;
    if (users[userId]) {
        ctx.reply(`💳 ያለህ ባላንስ፦ ${users[userId].balance} ብር`);
    }
});

// የስፒን መንኮራኩር (በቀላሉ ለሙከራ)
bot.hears('🎰 ስፒን አድርግ (Spin)', (ctx) => {
    const userId = ctx.from.id;
    if (users[userId]) {
        // እዚህ ጋር የዕጣ ስሌት ይገባል (በኋላ ሙሉ መንኮራኩር እንስራዋለን)
        const randomPrize = Math.floor(Math.random() * 50) + 10; // 10 እስከ 60 ብር
        users[userId].balance += randomPrize;
        ctx.reply(`🎉 እንኳን ደስ አለህ! ${randomPrize} ብር አሸንፈሃል።\n\nአዲስ ባላንስ፦ ${users[userId].balance} ብር`);
    }
});

// ገንዘብ ማውጣት (Withdraw)
bot.hears('💸 ገንዘብ አውጣ (Withdraw)', (ctx) => {
    const userId = ctx.from.id;
    if (users[userId]) {
        if (users[userId].balance < 1000) {
            ctx.reply(`⚠️ ዝቅተኛው የማውጣት መጠን 1000 ብር ነው።\n\nያለህ ባላንስ፦ ${users[userId].balance} ብር`);
        } else {
            ctx.reply('እባክህ የሚያወጣውን መጠን አስገባ (ቢያንስ 1000 ብር)፦');
        }
    }
});

bot.launch();
console.log('Trust Bingo Bot is running... 🚀');
