# ladka-aur-moongfali

- **Style:** risograph (four inks, flat + screened plates, paper knockouts, navy line art)
- **Format:** 9:16 · 1080×1920 · 59 s · 24 fps · a YouTube Short, Hindi voice-over
- **Story:** «The boy and the vendor»: a clever groundnut vendor gives children short weight
  and talks them round; a boy who is given too few nuts pays too few coins with the vendor's
  own excuse. Moral (the user's): «over smart people are likely to be outsmarted» —
  «ज़रूरत से ज़्यादा चालाक बनने वाले, अक्सर खुद ही मात खा जाते हैं».
- **Voice:** the user's ElevenLabs file (56.5 s, one take), kept in `private/` (not
  committed). `make-voice.sh` adds 0.5 s before it and pads to 59 s, and writes `mouth.js`,
  the voice's loudness per drawing, which opens the speaker's mouth.
- **Shorts safe area:** the action and the subtitles stay between y ≈ 250 and 1300 and left
  of x ≈ 780 (Shorts puts its title on top, buttons on the right, captions at the bottom).
- **Must NOT happen:** a fifth ink; light ink over dark without a knockout.

## Voice lines (measured with silencedetect; film time = file time + 0.5 s)

| # | Speaker | Line | Film time |
|---|---|---|---|
| 1 | narrator | एक गाँव में एक चालाक मूँगफली वाला रहता था। वह गरम-गरम भुनी मूँगफली बेचता था। | 0.5–6.4 |
| 2 | narrator | बच्चों को उसकी मूँगफली बहुत पसंद थी। पर वह अक्सर कम मूँगफली देता, और मीठी-मीठी बातों से बच्चों को बहला देता। | 6.9–14.8 |
| 3 | narrator | एक दिन, एक लड़का मूँगफली खरीदने आया। | 15.4–18.0 |
| 4 | vendor | लो बेटा, गरम-गरम मूँगफली! | 18.3–21.9 |
| 5 | boy | चाचा जी, आपने तो मुझे कम मूँगफली दी है! | 22.3–24.4 |
| 6 | vendor | अरे बेटा, कम मूँगफली उठाने में आसानी रहेगी! | 24.7–28.6 |
| 7 | narrator | लड़का कुछ नहीं बोला। उसने जेब से कुछ सिक्के निकाले, और मूँगफली वाले की हथेली पर रख दिए। | 28.9–35.0 |
| 8 | narrator | मूँगफली वाले ने पैसे गिने... तो पैसे कम निकले। | 35.7–39.1 |
| 9 | vendor | अरे बेटा! तुमने तो पैसे कम दिए हैं! | 39.4–42.0 |
| 10 | boy | हाँ चाचा जी, मुझे पता है। कम पैसे गिनने में आपको आसानी रहेगी! | 42.3–47.6 |
| 11 | narrator | मूँगफली वाले का मुँह खुला का खुला रह गया। सच ही है... ज़रूरत से ज़्यादा चालाक बनने वाले, अक्सर खुद ही मात खा जाते हैं। | 48.0–56.7 |

## Shot list (one street, the camera moves between the boy, the vendor and the palm)

| Time | Shot | What happens |
|---|---|---|
| 0–6.9 | The vendor | The street under bunting; the vendor stirs nuts in a kadhai over a flickering fire, smoke rising; a cat on the parapet; the title |
| 6.9–15.4 | Short weight | Two children come in turn; he scoops nuts, slips a handful back with a sideways glance, hands over a cone, chats them round |
| 15.4–18.3 | The boy | Raju walks in with his school bag |
| 18.3–22.2 | Lo beta | The scoop, the handful slipped back, the cone handed over |
| 22.2–24.6 | Kam di hai | Close on Raju looking into his half-empty cone |
| 24.6–28.8 | Aasani rahegi | Close on the vendor: a wink, a belly laugh |
| 28.8–35.6 | The coins | Raju says nothing, takes coins from his pocket, puts them on the open palm |
| 35.6–39.3 | Counting | Close on the palm: १, २, ३ — then a frown and a «?» |
| 39.3–42.2 | Kam diye | The vendor, shocked, brows up, a sweat drop |
| 42.2–47.9 | The answer | Raju smiles, answers, takes his cone and walks off eating |
| 47.9–51.2 | Outsmarted | The vendor's jaw drops, the coins still on his palm |
| 51.2–59 | Moral | Wide; he scratches his turban; the moral is written at the top |
