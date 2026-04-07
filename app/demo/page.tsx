"use client"

import { useEffect } from "react"
import Script from "next/script"

const BASE = "https://raw.githubusercontent.com/HoanghoDev/neon_v1/main"

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;600&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
body{
  background-color: #0f1b29;
  font-family: 'Open Sans', sans-serif;
  height: 100vh;
  overflow: hidden;
}
body::before{
  position: fixed;top:0;left:50%;width:100px;height:100vh;content:'';
  transform:translate(-50%,0);
  background-image:linear-gradient(to top,#C549A6,#F3B0E0);
  box-shadow:0 0 45px #ff8eae;
}
.container{
  background-color:#191d4a;width:1100px;height:600px;
  position:fixed;top:50%;left:50%;border-radius:10px;
  transform:translate(-50%,-50%);
}
.bg-rotate{
  position:absolute;top:50%;left:50%;width:300px;height:300px;
  border-radius:30% 70% 25% 75%/49% 35% 65% 51%;
  background-image:linear-gradient(to right,#ff58e3,rgb(67,64,246));
  transform:rotate(0deg) translate(-50%,-50%);
  z-index:-1;opacity:0.6;filter:blur(69px);
}
.effect{position:absolute;width:100%;left:0;top:0;height:100%;}
.wall-left{
  border:1.5px solid #00ffff;position:absolute;left:10%;top:100px;
  transition:1s;width:200px;border-radius:5px;height:400px;
  box-shadow:0 0 8px #26f8f8;
  transform:perspective(290px) rotate(-11deg) rotateY(29deg);
}
.wall-right{
  border:1.5px solid #F3B0E0;position:absolute;left:72%;top:100px;
  border-radius:5px;transition:1s;width:200px;height:400px;
  box-shadow:0 0 8px #ff8eae;
  transform:perspective(290px) rotate(11deg) rotateY(-29deg);
}
.hand1{
  width:250px;height:150px;
  background-image:url(${BASE}/hand1.png);
  background-position:left top;background-size:100%;background-repeat:no-repeat;
  position:absolute;top:50%;right:45%;opacity:0;
}
.hand2{
  width:250px;opacity:0;height:250px;
  background-image:url(${BASE}/hand2.png);
  background-position:left top;background-size:100%;background-repeat:no-repeat;
  position:absolute;top:37%;left:45%;
}
.show_effect_v1 .hand2{animation:hand2 3s ease-in-out 1s 1 forwards;}
.show_effect_v1 .hand1{animation:hand1 3s ease-in-out 1s 1 forwards;}
@keyframes hand1{
  0%{width:0;height:0;transform:rotate(-40deg) translate(0,150px);opacity:0;}
  50%{width:250px;height:250px;transform:rotate(0);opacity:1;}
  100%{transform:rotate(45deg) translate(90px,-90px);opacity:0;}
}
@keyframes hand2{
  0%{width:0;height:0;transform:rotate(-40deg) translate(0,150px);opacity:0;}
  50%{width:250px;height:250px;transform:rotate(0);opacity:1;}
  100%{transform:rotate(45deg) translate(-30px,90px);opacity:0;}
}
.show_effect_v1 .wall-left{animation:wall_left 3s ease-in-out 2.5s 1 forwards;}
.show_effect_v1 .wall-right{animation:wall_right 3s ease-in-out 2.5s 1 forwards;}
@keyframes wall_left{
  0%{left:10%;top:100px;width:200px;height:400px;transform:perspective(290px) rotate(-11deg) rotateY(29deg);}
  50%{left:50%;width:1px;transform:perspective(290px) rotate(0) rotateY(29deg);}
  100%{left:10%;top:100px;width:200px;height:400px;transform:perspective(290px) rotate(-11deg) rotateY(29deg);}
}
@keyframes wall_right{
  0%{width:200px;left:72%;top:100px;transform:perspective(290px) rotate(11deg) rotateY(-29deg);}
  50%{left:50%;width:1px;transform:perspective(290px) rotate(0) rotateY(-29deg);}
  100%{left:72%;top:100px;width:200px;transform:perspective(290px) rotate(11deg) rotateY(-29deg);}
}
.list_img img{width:290px;position:absolute;left:50%;top:20%;transform:translate(-50%,20px);}
.list_img .item{
  width:25%;position:absolute;top:50%;opacity:0;left:50%;
  transition:0;height:100%;overflow:hidden;transform:translate(-50%,-50%);
}
.list_img .active{opacity:0;animation:img_item_active 1s ease-in-out 4s 1 forwards;}
.list_img .active img{animation:img_active 3s ease-in-out 3s 1 forwards;}
.list_img .active::before{
  position:absolute;bottom:10%;left:18%;content:'';
  width:150px;height:70px;background-color:#0f8e8e;
  border-radius:50%;filter:blur(18px);opacity:0;
  animation:img_active_before 3s ease-in-out 3s 1 forwards;
}
@keyframes img_item_active{
  0%{opacity:0;width:0%;}1%{opacity:1;}100%{opacity:1;width:25%;}
}
@keyframes img_active{
  0%{transform:translate(-50%,-10px);}100%{transform:translate(-50%,20px);}
}
@keyframes img_active_before{
  0%{width:0;opacity:0;left:38%;}100%{width:150px;opacity:0.3;left:18%;}
}
.list_img .hide_item{opacity:1;animation:img_hide 1s ease-in-out 1 forwards;}
.list_img .hide_item::before{
  position:absolute;bottom:10%;left:18%;content:'';
  width:150px;height:70px;background-color:#0f8e8e;
  border-radius:50%;filter:blur(18px);
  animation:img_hide_before 1s ease-in-out 1 forwards;
}
@keyframes img_hide_before{
  0%{width:150px;opacity:0.3;left:18%;}100%{width:0;opacity:0;left:38%;}
}
@keyframes img_hide{0%{opacity:1;}100%{opacity:0;}}
.content .item{
  position:absolute;width:200px;color:#fff;padding:20px;
  text-shadow:0 0 5px #0CD891;top:40%;max-height:0;left:15%;opacity:0;
  transform:perspective(290px) rotate(-11deg) rotateY(29deg);
}
.content .item h2{color:#0CD891;font-weight:600;text-shadow:0 0 20px #0CD891;}
.content .item p{font-size:small;}
.content button{background-color:#F3C46C;border:none;color:#fff;padding:10px 20px;box-shadow:0 0 10px #E59342;}
.dots .item:nth-child(1){background-color:#EC5A64;width:30px;height:30px;clip-path:polygon(50% 0%,0% 100%,100% 100%);position:absolute;top:30%;left:30%;}
.dots .item:nth-child(2){background-color:#33D9C5;width:20px;height:20px;filter:blur(3px);position:absolute;top:60%;right:30%;}
.dots .item:nth-child(3){background-color:#33D9C5;width:20px;height:20px;position:absolute;top:50%;right:15%;}
.dots .item:nth-child(4){background-color:#F3C46C;width:10px;height:10px;position:absolute;top:50%;left:35%;filter:blur(3px);}
.dots{position:absolute;width:100%;height:100%;animation:dots 4s ease-in-out infinite alternate;}
@keyframes dots{0%{transform:translate(0,40px);}100%{transform:translate(0,0);}}
.show_effect_v1 .dots .item:nth-child(1){animation:dots_item_1 3s ease-out 3.1s 1 forwards;}
.show_effect_v1 .dots .item:nth-child(2){animation:dots_item_2 3s ease-out 3.1s 1 forwards;}
.show_effect_v1 .dots .item:nth-child(3){animation:dots_item_3 3s ease-out 3.1s 1 forwards;}
.show_effect_v1 .dots .item:nth-child(4){animation:dots_item_4 3s ease-out 3.1s 1 forwards;}
@keyframes dots_item_2{0%{top:60%;right:30%;opacity:1;transform:scale(1);}30%{opacity:0;top:55%;right:40%;transform:scale(0);}70%{top:67%;right:30%;opacity:0;transform:scale(1);}100%{top:60%;right:30%;opacity:1;}}
@keyframes dots_item_1{0%{top:30%;left:30%;opacity:1;transform:rotate(0);}30%{opacity:0;top:30%;left:50%;transform:rotate(490deg);}70%{transform:rotate(190deg);top:37%;left:30%;opacity:0;}100%{transform:rotate(0);top:30%;left:30%;opacity:1;}}
@keyframes dots_item_3{0%{top:50%;right:15%;opacity:1;transform:rotate(0);}30%{opacity:0;top:40%;right:50%;transform:rotate(490deg);}70%{transform:rotate(190deg);top:55%;right:15%;opacity:0;}100%{transform:rotate(0);top:50%;right:15%;opacity:1;}}
@keyframes dots_item_4{0%{top:50%;left:35%;opacity:1;}30%{opacity:0;top:49%;left:40%;}70%{top:50%;left:35%;opacity:0;}100%{top:50%;left:35%;opacity:1;}}
.content .active{animation:content_show 3s ease-out 6.1s 1 forwards;}
@keyframes content_show{from{opacity:0;}to{opacity:1;}}
.content .hide_item{animation:content_hide 2s ease-out 1 forwards;}
@keyframes content_hide{from{opacity:1;}to{opacity:0;}}
.dots-page{position:absolute;bottom:20px;left:50%;transform:translate(-50%,0);}
.dots-page div{width:10px;height:10px;display:inline-block;background-color:#dcdcdc;margin:10px;border-radius:50%;transition:0.8s;}
.dots-page .active{background-color:#C7CA3A;}
.logo{border-radius:50%;width:40px;height:40px;display:inline-block;box-shadow:0 0 5px rgb(209,204,204);}
.header ul{padding:0;margin:0;list-style:none;display:inline-block;transform:translate(0,-14px);}
.header li{display:inline-block;font-size:13px;color:#939292;margin-left:20px;}
.next{position:absolute;bottom:40px;right:40px;}
.next button{display:inline-block;border:none;padding:5px 7px;overflow:hidden;background-color:#939292;opacity:0.3;}
`

export default function DemoPage() {
  useEffect(() => {
    // Init slider once jQuery is loaded (via Script onLoad)
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <Script
        src="https://code.jquery.com/jquery-3.7.1.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          const $ = (window as any).$
          let count_group = $(".list_img .item").length
          let active = 0
          let begin = true

          function Load() {
            if (!begin) {
              const prev = active - 1 < 0 ? count_group - 1 : active - 1
              $(`#item_${prev}`).removeClass("active").addClass("hide_item")
              $(`#content_${prev}`).removeClass("active").addClass("hide_item")
            } else {
              begin = false
            }
            $(`#item_${active}`).removeClass("hide_item").addClass("active")
            $(`#content_${active}`).removeClass("hide_item").addClass("active")
            $(".dots-page div").removeClass("active")
            $(`#dot_${active}`).addClass("active")
            $(".effect").addClass("show_effect_v1")
            setTimeout(() => $(".effect").removeClass("show_effect_v1"), 6000)
          }

          Load()

          $("#next").on("click", () => {
            active = active + 1 >= count_group ? 0 : active + 1
            Load()
          })
          $("#prev").on("click", () => {
            active = active - 1 < 0 ? count_group - 1 : active - 1
            Load()
          })
        }}
      />

      <div className="container">
        <div className="bg-rotate" />

        {/* Header */}
        <div className="header" style={{ padding: "20px 30px", display: "flex", alignItems: "center" }}>
          <img src={`${BASE}/avatar.jpg`} className="logo" alt="logo" />
          <ul>
            <li>HOME</li>
            <li>CATEGORY</li>
            <li>INFO</li>
            <li>CONTACT</li>
          </ul>
        </div>

        {/* Effect overlay */}
        <div className="effect">
          <div className="wall-left" />
          <div className="wall-right" />
          <div className="hand1" />
          <div className="hand2" />
        </div>

        {/* Dots déco */}
        <div className="dots">
          <div className="item" />
          <div className="item" />
          <div className="item" />
          <div className="item" />
        </div>

        {/* Images produit */}
        <div className="list_img">
          {[1, 2, 3].map((n) => (
            <div key={n} className="item" id={`item_${n - 1}`}>
              <img src={`${BASE}/img${n}.png`} alt={`item ${n}`} />
            </div>
          ))}
        </div>

        {/* Texte contenu */}
        <div className="content">
          {["Nike Air Max", "Nike Air Force", "Nike Zoom"].map((name, i) => (
            <div key={i} className="item" id={`content_${i}`}>
              <h2>{name}</h2>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
              <br />
              <button>ADD TO CART</button>
            </div>
          ))}
        </div>

        {/* Pagination dots */}
        <div className="dots-page">
          {[0, 1, 2].map((i) => (
            <div key={i} id={`dot_${i}`} />
          ))}
        </div>

        {/* Boutons nav */}
        <div className="next">
          <button id="prev">{"<"}</button>
          <button id="next">{">"}</button>
        </div>
      </div>
    </>
  )
}
