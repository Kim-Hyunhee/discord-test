import {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  WebhookClient,
} from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const prefix = "!";

client.on("ready", () => {
  console.log(`${client.user.tag} 봇에 로그인 했습니다!`);
});

client.on("messageCreate", (msg) => {
  if (!msg.guild) return;
  if (msg.author.bot) return;
  if (!msg.content.startsWith(prefix)) return;

  const args = msg.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    msg.reply(`${client.ws.ping}ms`);
  }

  if (command === "embed") {
    const embed = new EmbedBuilder()
      .setTitle("여기는 대표 타이틀!")
      .setDescription("여기는 대표 설명!")
      .setColor(15258703)
      .setFooter({ text: "여기는 푸터!" })
      .setThumbnail(
        "http://blogfiles.naver.net/20151023_23/shin_0305_1445573936921jrPRT_JPEG/%BD%E6%B3%D7%C0%CF%BF%B9%BD%C3.jpg"
      )
      .setImage(
        "https://github.com/TEAM-SUITS/Suits/raw/develop/client/public/assets/og-image.jpg?raw=true"
      )
      .setTimestamp()
      .addFields({ name: "여기는 소제목", value: "여기는 설명" });

    msg.reply({ embeds: [embed] });
  }

  if (command === "webhook") {
    const hook = new WebhookClient({
      id: process.env.WEBHOOK_ID,
      token: process.env.WEBHOOK_TOKEN,
    });

    hook.send("Hello, new world!");
  }

  if (command === "kick") {
    const user = msg.mentions.users.first();

    if (!user) {
      msg.reply("추방하시기 전에 맨션을 먼저 해주세요!");
    } else {
      const member = msg.guild.members.resolve(user);

      if (member) {
        member
          .kick(`${msg.author.username}님에 의해 서버에서 추방됨.`)
          .then(() => {
            msg.reply(`성공적으로 ${user.tag}님을 추방하였습니다.`);
          })
          .catch(console.error);
      } else {
        msg.reply("이 서버에 존재하지 않는 유저입니다.");
      }
    }
  }

  if (command === "block") {
    const user = msg.mentions.users.first();

    if (!user) {
      msg.reply("차단하시기 전에 맨션을 먼저 해주세요!");
    } else {
      const member = msg.guild.members.resolve(user);

      if (member) {
        member
          .ban({ reason: `${msg.author.username}님에 의해 서버에서 차단됨.` })
          .then(() => {
            msg.reply(`성공적으로 ${user.tag}님을 차단하였습니다.`);
          })
          .catch(console.error);
      } else {
        msg.reply("이 서버에 존재하지 않는 유저입니다.");
      }
    }
  }

  if (command === "clean") {
    if (!args[0]) return msg.reply("청소할 만큼의 값을 정수로 적어주세요.");
    const deleteCount = parseInt(args[0], 10);

    if (isNaN(deleteCount) || deleteCount < 1 || deleteCount > 100)
      return msg.reply("1에서 100 사이의 값을 적어주세요.");

    msg.channel
      .bulkDelete(deleteCount)
      .then(() => {
        msg.reply(`${deleteCount}만큼의 메시지를 성공적으로 삭제했습니다.`);
      })
      .catch(console.error);
  }
});

client.login(process.env.DISCORD_TOKEN);
