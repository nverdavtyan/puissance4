(function ($) {
    $("#reload").click(function () {
        location.reload(true);
    });
    //button sound mute or on
    $(".mute").click(function () {
        let soundIcon = $('.mute');
        if ($("audio").prop('muted')) {
            soundIcon.html('<i class="fas fa-volume-up"></i>');
            $("audio").prop('muted', false);
        } else {
            $("audio").prop('muted', true);
            soundIcon.html('<i class="fas fa-volume-mute"></i>');
        }
    });
    /*Button full screen*/

    $('.fullscreen').on('click', function () {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();

        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    })

    $(".action").click(function () {
        $(".action").remove();
        $(".play").css('visibility', "visible");

        $.fn.P4 = function (options) {


            $("#play").click(function () {
                const X = $("#x").val();
                const Y = $("#y").val();
                const name1 = $("#name1").val();
                const name2 = $("#name2").val();
                const color1 = $("#color1").val();
                const color2 = $("#color2").val();
                $("#red").text(name1);
                $("#yellow").text(name2);
                if (name1 === name2 || color1 === color2  || name1==="" || name2==="" ) {
                    alert('Couleur ou pseudo identique');
                    return false;
                }
                $(".play").css('visibility', "hidden");
                $("#game").css('visibility', "visible");
                $("#reload").css('visibility', "visible");
                $(".scorecontainer").css('visibility', "visible");
                $("#redScore").css('background-color', color1);
                $("#yellowScore").css('background-color', color2);
                $('#game').ready(function () {

                    const p4 = new P4('#game', X, Y, name1, name2, color1, color2);

                    $('#restart, .restart').on('click', function () {
                        $('#game').empty();
                        $(".content")[0].firstChild.data = "";
                        $('.win').css('visibility', 'hidden');
                        $('.cancel').css('visibility', 'hidden');
                        $('.restart').css('visibility', 'hidden');


                        p4.grid();
                    });

                });
            });
            $("body").css('background', 'url(assets/bg_selection.jpg) repeat');
        };


        class P4 {
            constructor(selector, X, Y, name1, name2, color1, color2) {
                this.LGN = X;
                this.COL = Y;

                this.selector = selector;
                this.name1 = name1;
                this.name2 = name2;
                this.name = name1;
                this.player = 'red';
                this.color1 = color1;
                this.color2 = color2;
                this.scoreP1 = 0;
                this.scoreP2 = 0;
                this.step = 0;
                this.stepMax = X * Y;

                this.grid();
                this.event();
                this.checkWin();
                this.scoreWin();

            }
            grid() {
                const $jeu = $(this.selector);  //création la grille
                for (let x = 0; x < this.LGN; x++) {
                    const $lgn = $('<div>').addClass('lgn');
                    for (let y = 0; y < this.COL; y++) {
                        const $col = $('<div>')
                            .addClass('col empty')
                            .attr("data-col", y)
                            .attr("data-lgn", x);
                        $lgn.append($col)
                    }
                    $jeu.append($lgn)
                }
            }
            scoreWin(winner) {
                if (winner === this.name1) {
                    this.scoreP1++;
                    $('#redScore').text(this.scoreP1);
                }
                else if (winner === this.name2) {
                    this.scoreP2++;
                    $('#yellowScore').text(this.scoreP2);
                }
            }

            event() {
                const $jeu = $(this.selector);
                const that = this;
                function lastCase(col) {
                    const $cells = $(`.col[data-col='${col}']`);
                    for (let i = $cells.length - 1; i >= 0; i--) {
                        const $cell = $($cells[i]);
                        if ($cell.hasClass('empty')) {
                            return $cell;
                        }
                    }
                    return null;

                }

                $jeu.on('mouseenter', '.col', function () {
                    const $col = $(this).data('col');
                    const $last = lastCase($col);
                    if ($last != null) {
                        $last.addClass(`p${that.player}`);

                    }

                });

                $jeu.on('mouseleave', '.col', function () {
                    $('.col').removeClass(`p${that.player}`);
                });
                $("#round").css('visibility', "visible");

                $("#playerRound").text(`Au tour de joueur ${that.name} `);
                $(".pion").addClass(`pion${that.player}`)


                $jeu.on('click', '.col.empty', function () {
                    const col = $(this).data('col');
                    const $last = lastCase(col);
                    $last.addClass(`${that.player}`).removeClass(`empty p${that.player}`).data('player', `${that.player}`);
                    that.step++;
                    $(".red").css('background-color', that.color1);
                    $(".yellow").css('background-color', that.color2);

                    $('.cancel').css('visibility', 'visible');
                    $(".restart").css('visibility', "visible");
                    if (that.step === that.stepMax) {
                        $(".win").css('visibility', "visible");
                        $(".content").prepend(`Partie nulle plus de cases disponible`);
                        that.step = 0;
                    }

                    const winner = that.checkWin($last.data('lgn'), $last.data('col'));
                    that.name = (that.name === that.name1) ? that.name2 : that.name1;
                    that.player = (that.player === 'red') ? 'yellow' : 'red';

                    if (that.player === 'yellow') {
                        $(".pion").removeClass('pionred');
                        $(".pion").addClass('pionyellow');
                    } else {
                        $(".pion").removeClass('pionyellow');
                        $(".pion").addClass('pionred');
                    }

                    $("#playerRound").text(`Au tour de joueur ${that.name}`);

                    if (winner) {
                        that.scoreWin(winner);
                        $(".win").css('visibility', "visible");
                        $(".content").prepend(` ${winner} a gagné la partie`);
                        that.step = 0;
                        return;

                    }
                    that.lastCase = $last;
                })

                $('.cancel').on('click', function () {
                    that.name = (that.name === that.name1) ? that.name2 : that.name1;
                    that.player = (that.player === 'red') ? 'yellow' : 'red';  //changement de joueur : si player est red on passe à jaune, sinon on passe à red  
                    that.lastCase.removeClass(`${that.player}`).css('background-color', '').addClass('empty').removeData();
                    if (that.player === 'yellow') {
                        $(".pion").removeClass('pionred');
                        $(".pion").addClass('pionyellow');
                    } else {
                        $(".pion").removeClass('pionyellow');
                        $(".pion").addClass('pionred');
                    }
                    $("#playerRound").text(`Au tour de joueur ${that.name}`);
                    that.step--;
                    $('.cancel').css('visibility', 'hidden');
                })
            }

            checkWin(x, y) {
                const that = this;

                function $getCell(i, j) {
                    return $(`.col[data-lgn='${i}'][data-col='${j}']`);
                }


                function checkDirection(direction) {
                    let total = 0;
                    let i = x + direction.i;
                    let j = y + direction.j;
                    let $next = $getCell(i, j);


                    while (i >= 0 && i < that.LGN && j >= 0 && j < that.COL && $next.data('player') === that.player) {
                        total++;
                        i += direction.i;
                        j += direction.j;
                        $next = $getCell(i, j);
                    }
                    return total;
                }

                function checkWin(x, y) {
                    const total = 1 + checkDirection(x) + checkDirection(y);
                    if (total >= 4) {
                        return that.name;
                    } else {
                        return null;
                    }
                }


                function checkHorizontal() {  //vérification gagnant en horizontal
                    return checkWin({ i: 0, j: -1, }, { i: 0, j: 1 });
                }
                function checkVertical() {   //vérification gagnant en vertical
                    return checkWin({ i: -1, j: 0, }, { i: 1, j: 0 });
                }
                function checkDiagonal1() {   //vérification gagnant en diagonal gauche
                    return checkWin({ i: 1, j: 1, }, { i: -1, j: -1 });
                }
                function checkDiagonal2() {  //vérification gagnant en diagonal droite
                    return checkWin({ i: 1, j: -1, }, { i: -1, j: 1 });
                }

                return checkHorizontal() || checkVertical() || checkDiagonal1() || checkDiagonal2();
            }
        }

        $(".plugin").P4();
    });

}(jQuery));