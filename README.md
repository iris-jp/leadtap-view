# リードタップviewer
これはリードタップgeneratorで生成したコードでインタラクティブ動画を再生するためのツールになります。
リードタップgeneratorの詳細については以下を参照お願いします。  
[GitHub - iris-jp/leadtap-generator: インタラクティブ動画を作成するジェネレーター]
(https://github.com/iris-jp/leadtap-generator)

インタラクティブ動画のサンプルは以下になります。  
[インタラクティブ動画サンプル]
(https://iris-jp.github.io/leadtap-view/dist/)  

※環境によって動画の読み込みに時間がかかることがあるので、クリック後に少々お待ちください。


## 使い方について
リードタップgeneratorで生成したコードを設置したファイルでmirumaker.jsを読み込みます。  
mirumaker.jsと同じ階層でmirumaker.cssを読み込むので、mirumaker.jsとmirumaker.cssは同じ階層に設置してください。  
  
要素に対してclass="show_mirumaker_player"を指定して、動画を再生を実行することができます。  
ただし、現時点では同一ページ内で複数のインタラクティブ動画の再生は行えないので、同一のページで複数の複数のインタラクティブ動画の設置は行わないようにお願いします。

## 著作権について
Code copyright 2019 Interlogic CO., LTD.  
Code released under the MIT license  
https://opensource.org/licenses/mit-license.php
