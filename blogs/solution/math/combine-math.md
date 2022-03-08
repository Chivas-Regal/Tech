---
title: 组合数学
---
###  
<hr>

## 排列组合

### 洛谷P1066_2^k进制数

#### 🔗
<a href="https://www.luogu.com.cn/problem/P1066"><img src="https://i.loli.net/2021/11/09/L12VyJBogcEPT86.png"></a>

#### 💡
我们先打一个  <img src="https://latex.codecogs.com/svg.image?\inline&space;2^k" title="\inline 2^k" /> 进制和  <img src="https://latex.codecogs.com/svg.image?\inline&space;2" title="\inline 2" /> 进制的对应表看看  

::: details 表格
<table>
<tr><th>k</th><th> <img src="https://latex.codecogs.com/svg.image?\inline&space;10" title="\inline 10" />  进制</th><th> <img src="https://latex.codecogs.com/svg.image?\inline&space;2^k" title="\inline 2^k" /> 进制</th><th> <img src="https://latex.codecogs.com/svg.image?\inline&space;2" title="\inline 2" /> 进制</th></tr>
<tr><td rowspan="101">1</td></tr><tr><td>1</td><td>1</td><td>1</td></tr>
<tr><td>2</td><td>10</td><td>10</td></tr>
<tr><td>3</td><td>11</td><td>11</td></tr>
<tr><td>4</td><td>100</td><td>100</td></tr>
<tr><td>5</td><td>101</td><td>101</td></tr>
<tr><td>6</td><td>110</td><td>110</td></tr>
<tr><td>7</td><td>111</td><td>111</td></tr>
<tr><td>8</td><td>1000</td><td>1000</td></tr>
<tr><td>9</td><td>1001</td><td>1001</td></tr>
<tr><td>10</td><td>1010</td><td>1010</td></tr>
<tr><td>11</td><td>1011</td><td>1011</td></tr>
<tr><td>12</td><td>1100</td><td>1100</td></tr>
<tr><td>13</td><td>1101</td><td>1101</td></tr>
<tr><td>14</td><td>1110</td><td>1110</td></tr>
<tr><td>15</td><td>1111</td><td>1111</td></tr>
<tr><td>16</td><td>10000</td><td>10000</td></tr>
<tr><td>17</td><td>10001</td><td>10001</td></tr>
<tr><td>18</td><td>10010</td><td>10010</td></tr>
<tr><td>19</td><td>10011</td><td>10011</td></tr>
<tr><td>20</td><td>10100</td><td>10100</td></tr>
<tr><td>21</td><td>10101</td><td>10101</td></tr>
<tr><td>22</td><td>10110</td><td>10110</td></tr>
<tr><td>23</td><td>10111</td><td>10111</td></tr>
<tr><td>24</td><td>11000</td><td>11000</td></tr>
<tr><td>25</td><td>11001</td><td>11001</td></tr>
<tr><td>26</td><td>11010</td><td>11010</td></tr>
<tr><td>27</td><td>11011</td><td>11011</td></tr>
<tr><td>28</td><td>11100</td><td>11100</td></tr>
<tr><td>29</td><td>11101</td><td>11101</td></tr>
<tr><td>30</td><td>11110</td><td>11110</td></tr>
<tr><td>31</td><td>11111</td><td>11111</td></tr>
<tr><td>32</td><td>100000</td><td>100000</td></tr>
<tr><td>33</td><td>100001</td><td>100001</td></tr>
<tr><td>34</td><td>100010</td><td>100010</td></tr>
<tr><td>35</td><td>100011</td><td>100011</td></tr>
<tr><td>36</td><td>100100</td><td>100100</td></tr>
<tr><td>37</td><td>100101</td><td>100101</td></tr>
<tr><td>38</td><td>100110</td><td>100110</td></tr>
<tr><td>39</td><td>100111</td><td>100111</td></tr>
<tr><td>40</td><td>101000</td><td>101000</td></tr>
<tr><td>41</td><td>101001</td><td>101001</td></tr>
<tr><td>42</td><td>101010</td><td>101010</td></tr>
<tr><td>43</td><td>101011</td><td>101011</td></tr>
<tr><td>44</td><td>101100</td><td>101100</td></tr>
<tr><td>45</td><td>101101</td><td>101101</td></tr>
<tr><td>46</td><td>101110</td><td>101110</td></tr>
<tr><td>47</td><td>101111</td><td>101111</td></tr>
<tr><td>48</td><td>110000</td><td>110000</td></tr>
<tr><td>49</td><td>110001</td><td>110001</td></tr>
<tr><td>50</td><td>110010</td><td>110010</td></tr>
<tr><td>51</td><td>110011</td><td>110011</td></tr>
<tr><td>52</td><td>110100</td><td>110100</td></tr>
<tr><td>53</td><td>110101</td><td>110101</td></tr>
<tr><td>54</td><td>110110</td><td>110110</td></tr>
<tr><td>55</td><td>110111</td><td>110111</td></tr>
<tr><td>56</td><td>111000</td><td>111000</td></tr>
<tr><td>57</td><td>111001</td><td>111001</td></tr>
<tr><td>58</td><td>111010</td><td>111010</td></tr>
<tr><td>59</td><td>111011</td><td>111011</td></tr>
<tr><td>60</td><td>111100</td><td>111100</td></tr>
<tr><td>61</td><td>111101</td><td>111101</td></tr>
<tr><td>62</td><td>111110</td><td>111110</td></tr>
<tr><td>63</td><td>111111</td><td>111111</td></tr>
<tr><td>64</td><td>1000000</td><td>1000000</td></tr>
<tr><td>65</td><td>1000001</td><td>1000001</td></tr>
<tr><td>66</td><td>1000010</td><td>1000010</td></tr>
<tr><td>67</td><td>1000011</td><td>1000011</td></tr>
<tr><td>68</td><td>1000100</td><td>1000100</td></tr>
<tr><td>69</td><td>1000101</td><td>1000101</td></tr>
<tr><td>70</td><td>1000110</td><td>1000110</td></tr>
<tr><td>71</td><td>1000111</td><td>1000111</td></tr>
<tr><td>72</td><td>1001000</td><td>1001000</td></tr>
<tr><td>73</td><td>1001001</td><td>1001001</td></tr>
<tr><td>74</td><td>1001010</td><td>1001010</td></tr>
<tr><td>75</td><td>1001011</td><td>1001011</td></tr>
<tr><td>76</td><td>1001100</td><td>1001100</td></tr>
<tr><td>77</td><td>1001101</td><td>1001101</td></tr>
<tr><td>78</td><td>1001110</td><td>1001110</td></tr>
<tr><td>79</td><td>1001111</td><td>1001111</td></tr>
<tr><td>80</td><td>1010000</td><td>1010000</td></tr>
<tr><td>81</td><td>1010001</td><td>1010001</td></tr>
<tr><td>82</td><td>1010010</td><td>1010010</td></tr>
<tr><td>83</td><td>1010011</td><td>1010011</td></tr>
<tr><td>84</td><td>1010100</td><td>1010100</td></tr>
<tr><td>85</td><td>1010101</td><td>1010101</td></tr>
<tr><td>86</td><td>1010110</td><td>1010110</td></tr>
<tr><td>87</td><td>1010111</td><td>1010111</td></tr>
<tr><td>88</td><td>1011000</td><td>1011000</td></tr>
<tr><td>89</td><td>1011001</td><td>1011001</td></tr>
<tr><td>90</td><td>1011010</td><td>1011010</td></tr>
<tr><td>91</td><td>1011011</td><td>1011011</td></tr>
<tr><td>92</td><td>1011100</td><td>1011100</td></tr>
<tr><td>93</td><td>1011101</td><td>1011101</td></tr>
<tr><td>94</td><td>1011110</td><td>1011110</td></tr>
<tr><td>95</td><td>1011111</td><td>1011111</td></tr>
<tr><td>96</td><td>1100000</td><td>1100000</td></tr>
<tr><td>97</td><td>1100001</td><td>1100001</td></tr>
<tr><td>98</td><td>1100010</td><td>1100010</td></tr>
<tr><td>99</td><td>1100011</td><td>1100011</td></tr>
<tr><td>100</td><td>1100100</td><td>1100100</td></tr>
<tr><td rowspan="101">2</td></tr><tr><td>1</td><td>1</td><td>1</td></tr>
<tr><td>2</td><td>2</td><td>10</td></tr>
<tr><td>3</td><td>3</td><td>11</td></tr>
<tr><td>4</td><td>10</td><td>100</td></tr>
<tr><td>5</td><td>11</td><td>101</td></tr>
<tr><td>6</td><td>12</td><td>110</td></tr>
<tr><td>7</td><td>13</td><td>111</td></tr>
<tr><td>8</td><td>20</td><td>1000</td></tr>
<tr><td>9</td><td>21</td><td>1001</td></tr>
<tr><td>10</td><td>22</td><td>1010</td></tr>
<tr><td>11</td><td>23</td><td>1011</td></tr>
<tr><td>12</td><td>30</td><td>1100</td></tr>
<tr><td>13</td><td>31</td><td>1101</td></tr>
<tr><td>14</td><td>32</td><td>1110</td></tr>
<tr><td>15</td><td>33</td><td>1111</td></tr>
<tr><td>16</td><td>100</td><td>10000</td></tr>
<tr><td>17</td><td>101</td><td>10001</td></tr>
<tr><td>18</td><td>102</td><td>10010</td></tr>
<tr><td>19</td><td>103</td><td>10011</td></tr>
<tr><td>20</td><td>110</td><td>10100</td></tr>
<tr><td>21</td><td>111</td><td>10101</td></tr>
<tr><td>22</td><td>112</td><td>10110</td></tr>
<tr><td>23</td><td>113</td><td>10111</td></tr>
<tr><td>24</td><td>120</td><td>11000</td></tr>
<tr><td>25</td><td>121</td><td>11001</td></tr>
<tr><td>26</td><td>122</td><td>11010</td></tr>
<tr><td>27</td><td>123</td><td>11011</td></tr>
<tr><td>28</td><td>130</td><td>11100</td></tr>
<tr><td>29</td><td>131</td><td>11101</td></tr>
<tr><td>30</td><td>132</td><td>11110</td></tr>
<tr><td>31</td><td>133</td><td>11111</td></tr>
<tr><td>32</td><td>200</td><td>100000</td></tr>
<tr><td>33</td><td>201</td><td>100001</td></tr>
<tr><td>34</td><td>202</td><td>100010</td></tr>
<tr><td>35</td><td>203</td><td>100011</td></tr>
<tr><td>36</td><td>210</td><td>100100</td></tr>
<tr><td>37</td><td>211</td><td>100101</td></tr>
<tr><td>38</td><td>212</td><td>100110</td></tr>
<tr><td>39</td><td>213</td><td>100111</td></tr>
<tr><td>40</td><td>220</td><td>101000</td></tr>
<tr><td>41</td><td>221</td><td>101001</td></tr>
<tr><td>42</td><td>222</td><td>101010</td></tr>
<tr><td>43</td><td>223</td><td>101011</td></tr>
<tr><td>44</td><td>230</td><td>101100</td></tr>
<tr><td>45</td><td>231</td><td>101101</td></tr>
<tr><td>46</td><td>232</td><td>101110</td></tr>
<tr><td>47</td><td>233</td><td>101111</td></tr>
<tr><td>48</td><td>300</td><td>110000</td></tr>
<tr><td>49</td><td>301</td><td>110001</td></tr>
<tr><td>50</td><td>302</td><td>110010</td></tr>
<tr><td>51</td><td>303</td><td>110011</td></tr>
<tr><td>52</td><td>310</td><td>110100</td></tr>
<tr><td>53</td><td>311</td><td>110101</td></tr>
<tr><td>54</td><td>312</td><td>110110</td></tr>
<tr><td>55</td><td>313</td><td>110111</td></tr>
<tr><td>56</td><td>320</td><td>111000</td></tr>
<tr><td>57</td><td>321</td><td>111001</td></tr>
<tr><td>58</td><td>322</td><td>111010</td></tr>
<tr><td>59</td><td>323</td><td>111011</td></tr>
<tr><td>60</td><td>330</td><td>111100</td></tr>
<tr><td>61</td><td>331</td><td>111101</td></tr>
<tr><td>62</td><td>332</td><td>111110</td></tr>
<tr><td>63</td><td>333</td><td>111111</td></tr>
<tr><td>64</td><td>1000</td><td>1000000</td></tr>
<tr><td>65</td><td>1001</td><td>1000001</td></tr>
<tr><td>66</td><td>1002</td><td>1000010</td></tr>
<tr><td>67</td><td>1003</td><td>1000011</td></tr>
<tr><td>68</td><td>1010</td><td>1000100</td></tr>
<tr><td>69</td><td>1011</td><td>1000101</td></tr>
<tr><td>70</td><td>1012</td><td>1000110</td></tr>
<tr><td>71</td><td>1013</td><td>1000111</td></tr>
<tr><td>72</td><td>1020</td><td>1001000</td></tr>
<tr><td>73</td><td>1021</td><td>1001001</td></tr>
<tr><td>74</td><td>1022</td><td>1001010</td></tr>
<tr><td>75</td><td>1023</td><td>1001011</td></tr>
<tr><td>76</td><td>1030</td><td>1001100</td></tr>
<tr><td>77</td><td>1031</td><td>1001101</td></tr>
<tr><td>78</td><td>1032</td><td>1001110</td></tr>
<tr><td>79</td><td>1033</td><td>1001111</td></tr>
<tr><td>80</td><td>1100</td><td>1010000</td></tr>
<tr><td>81</td><td>1101</td><td>1010001</td></tr>
<tr><td>82</td><td>1102</td><td>1010010</td></tr>
<tr><td>83</td><td>1103</td><td>1010011</td></tr>
<tr><td>84</td><td>1110</td><td>1010100</td></tr>
<tr><td>85</td><td>1111</td><td>1010101</td></tr>
<tr><td>86</td><td>1112</td><td>1010110</td></tr>
<tr><td>87</td><td>1113</td><td>1010111</td></tr>
<tr><td>88</td><td>1120</td><td>1011000</td></tr>
<tr><td>89</td><td>1121</td><td>1011001</td></tr>
<tr><td>90</td><td>1122</td><td>1011010</td></tr>
<tr><td>91</td><td>1123</td><td>1011011</td></tr>
<tr><td>92</td><td>1130</td><td>1011100</td></tr>
<tr><td>93</td><td>1131</td><td>1011101</td></tr>
<tr><td>94</td><td>1132</td><td>1011110</td></tr>
<tr><td>95</td><td>1133</td><td>1011111</td></tr>
<tr><td>96</td><td>1200</td><td>1100000</td></tr>
<tr><td>97</td><td>1201</td><td>1100001</td></tr>
<tr><td>98</td><td>1202</td><td>1100010</td></tr>
<tr><td>99</td><td>1203</td><td>1100011</td></tr>
<tr><td>100</td><td>1210</td><td>1100100</td></tr>
<tr><td rowspan="101">3</td></tr><tr><td>1</td><td>1</td><td>1</td></tr>
<tr><td>2</td><td>2</td><td>10</td></tr>
<tr><td>3</td><td>3</td><td>11</td></tr>
<tr><td>4</td><td>4</td><td>100</td></tr>
<tr><td>5</td><td>5</td><td>101</td></tr>
<tr><td>6</td><td>6</td><td>110</td></tr>
<tr><td>7</td><td>7</td><td>111</td></tr>
<tr><td>8</td><td>10</td><td>1000</td></tr>
<tr><td>9</td><td>11</td><td>1001</td></tr>
<tr><td>10</td><td>12</td><td>1010</td></tr>
<tr><td>11</td><td>13</td><td>1011</td></tr>
<tr><td>12</td><td>14</td><td>1100</td></tr>
<tr><td>13</td><td>15</td><td>1101</td></tr>
<tr><td>14</td><td>16</td><td>1110</td></tr>
<tr><td>15</td><td>17</td><td>1111</td></tr>
<tr><td>16</td><td>20</td><td>10000</td></tr>
<tr><td>17</td><td>21</td><td>10001</td></tr>
<tr><td>18</td><td>22</td><td>10010</td></tr>
<tr><td>19</td><td>23</td><td>10011</td></tr>
<tr><td>20</td><td>24</td><td>10100</td></tr>
<tr><td>21</td><td>25</td><td>10101</td></tr>
<tr><td>22</td><td>26</td><td>10110</td></tr>
<tr><td>23</td><td>27</td><td>10111</td></tr>
<tr><td>24</td><td>30</td><td>11000</td></tr>
<tr><td>25</td><td>31</td><td>11001</td></tr>
<tr><td>26</td><td>32</td><td>11010</td></tr>
<tr><td>27</td><td>33</td><td>11011</td></tr>
<tr><td>28</td><td>34</td><td>11100</td></tr>
<tr><td>29</td><td>35</td><td>11101</td></tr>
<tr><td>30</td><td>36</td><td>11110</td></tr>
<tr><td>31</td><td>37</td><td>11111</td></tr>
<tr><td>32</td><td>40</td><td>100000</td></tr>
<tr><td>33</td><td>41</td><td>100001</td></tr>
<tr><td>34</td><td>42</td><td>100010</td></tr>
<tr><td>35</td><td>43</td><td>100011</td></tr>
<tr><td>36</td><td>44</td><td>100100</td></tr>
<tr><td>37</td><td>45</td><td>100101</td></tr>
<tr><td>38</td><td>46</td><td>100110</td></tr>
<tr><td>39</td><td>47</td><td>100111</td></tr>
<tr><td>40</td><td>50</td><td>101000</td></tr>
<tr><td>41</td><td>51</td><td>101001</td></tr>
<tr><td>42</td><td>52</td><td>101010</td></tr>
<tr><td>43</td><td>53</td><td>101011</td></tr>
<tr><td>44</td><td>54</td><td>101100</td></tr>
<tr><td>45</td><td>55</td><td>101101</td></tr>
<tr><td>46</td><td>56</td><td>101110</td></tr>
<tr><td>47</td><td>57</td><td>101111</td></tr>
<tr><td>48</td><td>60</td><td>110000</td></tr>
<tr><td>49</td><td>61</td><td>110001</td></tr>
<tr><td>50</td><td>62</td><td>110010</td></tr>
<tr><td>51</td><td>63</td><td>110011</td></tr>
<tr><td>52</td><td>64</td><td>110100</td></tr>
<tr><td>53</td><td>65</td><td>110101</td></tr>
<tr><td>54</td><td>66</td><td>110110</td></tr>
<tr><td>55</td><td>67</td><td>110111</td></tr>
<tr><td>56</td><td>70</td><td>111000</td></tr>
<tr><td>57</td><td>71</td><td>111001</td></tr>
<tr><td>58</td><td>72</td><td>111010</td></tr>
<tr><td>59</td><td>73</td><td>111011</td></tr>
<tr><td>60</td><td>74</td><td>111100</td></tr>
<tr><td>61</td><td>75</td><td>111101</td></tr>
<tr><td>62</td><td>76</td><td>111110</td></tr>
<tr><td>63</td><td>77</td><td>111111</td></tr>
<tr><td>64</td><td>100</td><td>1000000</td></tr>
<tr><td>65</td><td>101</td><td>1000001</td></tr>
<tr><td>66</td><td>102</td><td>1000010</td></tr>
<tr><td>67</td><td>103</td><td>1000011</td></tr>
<tr><td>68</td><td>104</td><td>1000100</td></tr>
<tr><td>69</td><td>105</td><td>1000101</td></tr>
<tr><td>70</td><td>106</td><td>1000110</td></tr>
<tr><td>71</td><td>107</td><td>1000111</td></tr>
<tr><td>72</td><td>110</td><td>1001000</td></tr>
<tr><td>73</td><td>111</td><td>1001001</td></tr>
<tr><td>74</td><td>112</td><td>1001010</td></tr>
<tr><td>75</td><td>113</td><td>1001011</td></tr>
<tr><td>76</td><td>114</td><td>1001100</td></tr>
<tr><td>77</td><td>115</td><td>1001101</td></tr>
<tr><td>78</td><td>116</td><td>1001110</td></tr>
<tr><td>79</td><td>117</td><td>1001111</td></tr>
<tr><td>80</td><td>120</td><td>1010000</td></tr>
<tr><td>81</td><td>121</td><td>1010001</td></tr>
<tr><td>82</td><td>122</td><td>1010010</td></tr>
<tr><td>83</td><td>123</td><td>1010011</td></tr>
<tr><td>84</td><td>124</td><td>1010100</td></tr>
<tr><td>85</td><td>125</td><td>1010101</td></tr>
<tr><td>86</td><td>126</td><td>1010110</td></tr>
<tr><td>87</td><td>127</td><td>1010111</td></tr>
<tr><td>88</td><td>130</td><td>1011000</td></tr>
<tr><td>89</td><td>131</td><td>1011001</td></tr>
<tr><td>90</td><td>132</td><td>1011010</td></tr>
<tr><td>91</td><td>133</td><td>1011011</td></tr>
<tr><td>92</td><td>134</td><td>1011100</td></tr>
<tr><td>93</td><td>135</td><td>1011101</td></tr>
<tr><td>94</td><td>136</td><td>1011110</td></tr>
<tr><td>95</td><td>137</td><td>1011111</td></tr>
<tr><td>96</td><td>140</td><td>1100000</td></tr>
<tr><td>97</td><td>141</td><td>1100001</td></tr>
<tr><td>98</td><td>142</td><td>1100010</td></tr>
<tr><td>99</td><td>143</td><td>1100011</td></tr>
<tr><td>100</td><td>144</td><td>1100100</td></tr>
</table>
:::
  
可以发现几个有趣的事情：  
$1.$  $2^k$ 进制对于  $2$ 进制的进位极限在 $2^k$ 进制表示的最高位上呈这样的排列  
 <table>
 <tr><th>k=1</th><td>1,1,1,1,1,1,...</td></tr>
 <tr><th>k=2</th><td>1,3,1,3,1,3,...</td></tr>
 <tr><th>k=3</th><td>1,3,7,1,3,7,...</td></tr>
 </table>  
 那么我们可以从中推出  
  <table>
 <tr><th>k=x</th><td> $2^0-1,2^1-1,2^2-1,...2^x-1,2^0-1,2^1-1,2^2-1,....,2^x-1....$</td></tr>
 </table>  
 
$2.$ $2^k$ 进制下，在这个排列里面，一次循环  $2^k$ 进制会进一位  
  
    
    
对于题目，我们走完这个排列中  <img src="https://latex.codecogs.com/svg.image?\inline&space;w" title="\inline w" /> 个数就可以结束了    
我们枚举最高位的数字  <img src="https://latex.codecogs.com/svg.image?\inline&space;[1,2^k-1]" title="\inline [1,2^k-1]" />  ，可知在一次循环中我们  <img src="https://latex.codecogs.com/svg.image?\inline&space;2^k" title="\inline 2^k" /> 进制的位数时不变的  
且如果  <img src="https://latex.codecogs.com/svg.image?\inline&space;i+1" title="\inline i+1" /> 是  <img src="https://latex.codecogs.com/svg.image?\inline&space;2" title="\inline 2" /> 的幂次，即  <img src="https://latex.codecogs.com/svg.image?\inline&space;lowbit(i+1)=i+1" title="\inline lowbit(i+1)=i+1" />  那么就说明我们走过了排列中的一个数也就是在  <img src="https://latex.codecogs.com/svg.image?\inline&space;2" title="\inline 2" /> 进制下进了一位    
而我们想要在最高位  <img src="https://latex.codecogs.com/svg.image?\inline&space;i" title="\inline i" />  数字为  <img src="https://latex.codecogs.com/svg.image?\inline&space;j" title="\inline j" /> 时后面低位有多少种构造方式，可以通过  <img src="https://latex.codecogs.com/svg.image?\inline&space;dp[i][j]" title="\inline dp[i][j]" /> 预处理一下  
 <img src="https://latex.codecogs.com/svg.image?\inline&space;\begin{aligned}dp[i][j]&=\sum\limits_{x=1}^{(1<<k)-1}dp[i-1][x]\\&=dp[i][j-1]+dp[i-1][j]\end{aligned}" title="\inline \begin{aligned}dp[i][j]&=\sum\limits_{x=1}^{(1<<k)-1}dp[i-1][x]\\&=dp[i][j-1]+dp[i-1][j]\end{aligned}" />  

但是我们这个是计算了  <img src="https://latex.codecogs.com/svg.image?\inline&space;2^k" title="\inline 2^k" /> 进制下的所有可行位数，最后还要按要求减掉  <img src="https://latex.codecogs.com/svg.image?\inline&space;1" title="\inline 1" /> 位的  

这里上  <img src="https://latex.codecogs.com/svg.image?\inline&space;Java" title="\inline Java" /> 高精 

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```java
public class Main {

        static BigInteger zero = BigInteger.ZERO;
        static BigInteger one = BigInteger.ONE;
        static BigInteger two = BigInteger.valueOf(2);
        static BigInteger six = BigInteger.valueOf(6);
        static BigInteger ten = BigInteger.TEN;

        static int N = 1000;
        static BigInteger[][] dp = new BigInteger[N][N];
        static int k, w;

        public static void Get_Dp () {
                for ( int i = 0; i < N; i ++ ) for ( int j = 0; j < N; j ++ ) dp[i][j] = zero;
                for ( int i = 1; i < (1 << k); i ++ ) dp[1][i] = one;
                for ( int i = 2; i < (1 << k); i ++ ) {
                        for ( int j = 2; j < (1 << k); j ++ ) dp[i][1] = dp[i][1].add(dp[i - 1][j]);
                        for ( int j = 2; j < (1 << k); j ++ ) dp[i][j] = dp[i][j - 1].subtract(dp[i - 1][j]);
                }
        }
        public static int lowbit ( int x ) { return x & (-x); }
        public static void main (String[] args) {
                Scanner input = new Scanner(System.in);
                k = input.nextInt();
                w = input.nextInt(); int tmp = w;
                Get_Dp();

                int num = 1;
                BigInteger res = zero;
                boolean flag = false;
                while ( true ) {
                        for ( int i = 1; i < (1 << k); i ++ ) {         // 枚举最高位
                                res = res.add(dp[num][i]);              // num个数字，最高位是i的构造方式
                                if ( lowbit(i + 1) == i + 1 ) w --;     // 是排列中的一个数，进了一位
                                if ( w == 0 ) { flag = true; break; }   // 进到头了
                        }
                        if ( flag ) break;
                        num ++;
                }

                w = tmp;
                for ( int i = 1; i < (1 << k); i ++ ) { // 减去(2^k)长度为1的串
                        res = res.subtract(dp[1][i]);
                        if ( lowbit(i + 1) == i + 1 ) w --;
                        if ( w == 0 ) break;
                }
                System.out.println(res);
                input.close();
        }
}
```

<hr>

### 洛谷P2290_树的计数

#### 🔗
<a href="https://www.luogu.com.cn/problem/P2290"><img src="https://img-blog.csdnimg.cn/18b01b4fd60e4e1cac1ed7de753a8151.png"></a>

#### 💡
直接根据<a href="">Prufer编码性质3推论</a>进行这个式子的计算  
不过需要特判很多地方  
1.如果节点数为1，输入的点度数只能是一个0  
2.如果节点数不为1，有一个节点度数是0就不行  
3.如果节点数不为1，<img src="https://latex.codecogs.com/svg.image?\sum\limits_{i=1}^nd_i&space;-&space;n&space;=&space;n-2" title="\sum\limits_{i=1}^nd_i - n = n-2" />才行  
  
这些特判判掉之后就进行计算即可  
要开高精

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```java
public class Main {
        public static BigInteger one = BigInteger.ONE;
        public static BigInteger zero = BigInteger.ZERO;
        public static BigInteger two = BigInteger.valueOf(2);
        public static BigInteger ten = BigInteger.TEN;
        
        static int N = 200;
        static BigInteger[] f = new BigInteger[N];
        public static void get_F () {
                f[0] = one;
                for ( int i = 1; i < N; i ++ ) {
                        f[i] = f[i - 1].multiply(BigInteger.valueOf(i));
                }
        }
        static int n;
        static int[] d = new int[N];
        static int sumd = 0;

        public static void main ( String[] args ) {
                get_F();
                Scanner input = new Scanner(System.in);
                n = input.nextInt();
                for ( int i = 0; i < n; i ++ ) {
                        d[i] = input.nextInt();
                        sumd += d[i] - 1;
                }
                if ( n == 1 ) {
                        if ( d[0] == 0 ) System.out.println(1);
                        else             System.out.println(0);
                        return;
                }
                if ( sumd != n - 2 ) {
                        System.out.println(0);
                        return;
                }
                for ( int i = 0; i < n; i ++ )
                        if ( d[i] == 0 ) {
                                System.out.println(0);
                                return;
                        }

                BigInteger up = f[n - 2];
                BigInteger down = one;
                for ( int i = 0; i < n; i ++ ) down = down.multiply(f[d[i] - 1]);
                if ( down.compareTo(zero) != 0 ) System.out.println(up.divide(down));
                else                             System.out.println(0);

                input.close();
        }
}
```

<hr>

### 洛谷P2606_排列计数

#### 🔗
<a href="https://www.luogu.com.cn/problem/P2606"><img src="https://i.loli.net/2021/11/19/OYNjF4ecQx7MyCl.png"></a>

#### 💡
看到这个约束条件  <img src="https://latex.codecogs.com/svg.image?\inline&space;[1\rightarrow2\And3],[2\rightarrow4\And5],..." title="\inline 1\rightarrow2\And3,2\rightarrow4\And5,..." />   
我们可以构建出一棵二叉树  
从  <img src="https://latex.codecogs.com/svg.image?\inline&space;1" title="\inline 1" />  开始，我们有  <img src="https://latex.codecogs.com/svg.image?\inline&space;Sz_1" title="\inline Sz_1" /> 个节点，可以选择  <img src="https://latex.codecogs.com/svg.image?\inline&space;\binom{Sz_1-1}{Sz_2}" title="\inline \binom{Sz_1-1}{Sz_2}" /> 放入二号子树，其余放入三号子树  
通俗地说，就是  <img src="https://latex.codecogs.com/svg.image?\inline&space;\binom{Sz_x-1}{Sz_{x\times&space;2}}" title="\inline " /> 放入左子树，其余放入右子树  
这样就是  <img src="https://latex.codecogs.com/svg.image?\inline&space;C(Sz_x-1,Sz{x\times&space;2\times&space;Dfs(x\times2)\times&space;Dfs(x\times2+1)" title="\inline C(S" />   
  
注意模数可能很小，所以我们需要用  <img src="https://latex.codecogs.com/svg.image?\inline&space;Lucas" title="\inline Lucas" /> 定理  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
const int N = 3e6 + 10;

int n, mod;

inline ll ksm ( ll a, ll b ) { ll res = 1; while ( b ) { if ( b & 1 ) res = res * a % mod; a = a * a % mod; b >>= 1; } return res; }
inline ll inv ( ll x ) { return ksm(x, mod - 2); }
ll fac[N]; inline void get_Fac () { fac[0] = 1; for ( int i = 1; i < N; i ++ ) fac[i] = fac[i - 1] * i % mod; }
inline ll C ( ll n, ll m ) { 
        if ( n < m )   return 0;
        if ( n < mod ) return fac[n] * inv(fac[n - m]) % mod * inv(fac[m]) % mod; 
        return C ( n / mod, m / mod ) * C ( n % mod, m % mod ) % mod;
}

namespace Tree {
        ll sz[N];
        inline void get_Sz ( ll x ) {
                sz[x] = 1;
                if ( x * 2 <= n )     get_Sz ( x * 2 ),     sz[x] += sz[x * 2];
                if ( x * 2 + 1 <= n ) get_Sz ( x * 2 + 1 ), sz[x] += sz[x * 2 + 1];
        }
        inline ll dfs ( ll x ) {
                if ( x > n ) return 1; 
                return C ( sz[x] - 1, sz[2 * x] ) * dfs ( 2 * x ) % mod * dfs ( 2 * x + 1 ) % mod;
        }
} using namespace Tree;

int main () { 
        cin >> n >> mod;
        get_Fac (); get_Sz ( 1 );
        cout << dfs ( 1 ) << endl;
}
```

<hr>

### 洛谷P4936_Agent1

#### 🔗
<a href="https://www.luogu.com.cn/problem/P4936"><img src="https://i.loli.net/2021/11/14/Q5Y7Z8RilKTuLyV.png"></a>

#### 💡
AB两队，每队必出一个人  
我们可以枚举每队谁必出，然后为了保证  <img src="https://latex.codecogs.com/svg.image?\inline&space;max\{A\}<min\{B\}" title="\inline max\{A\}<min\{B\}" /> 我们让每队出的两个人中间的数必不出，两侧的数选出  
这样的话就是  <img src="https://latex.codecogs.com/svg.image?\inline&space;\sum\limits_{i=1}^n\sum\limits_{j=i+1}^n(2^{i-1}\times&space;2^{n-j})" title="\inline \sum\limits_{i=1}^n\sum\limits_{j=i+1}^n(2^{i-1}\times&space;2^{n-j})" />   
这是一个  <img src="https://latex.codecogs.com/svg.image?\inline&space;O(n^2)" title="\inline O(n^2)" /> 的柿子，我们优化一下  
  
 <img src="https://latex.codecogs.com/svg.image?\inline&space;\begin{aligned}&\sum\limits_{i=1}^n\sum\limits_{j=i+1}^n(2^{i-1}\times&space;2^{n-j})\\=&\sum\limits_{i=1}^n\sum\limits_{j=0}^{n-i-1}(2^{i-1}\times&space;2^j)\\=&\sum\limits_{i=0}^{n-1}\sum\limits_{j=0}^{n-i-2}(2^i\times&space;2^j)\\=&\sum\limits_{i=0}^{n-1}2^i\sum\limits_{j=0}^{n-i-2}2^j\\=&\sum\limits_{i=0}^{n-1}(2^i\times(2^{n-i-1}-1))\\=&\sum\limits_{i=0}^{n-1}(2^{n-1}-2^i)\\=&n2^{n-1}-(2^n-1)\end{aligned}" title="\inline \begin{aligned}&\sum\limits_{i=1}^n\sum\limits_{j=i+1}^n(2^{i-1}\times&space;2^{n-j})\\=&\sum\limits_{i=1}^n\sum\limits_{j=0}^{n-i-1}(2^{i-1}\times&space;2^j)\\=&\sum\limits_{i=0}^{n-1}\sum\limits_{j=0}^{n-i-2}(2^i\times&space;2^j)\\=&\sum\limits_{i=0}^{n-1}2^i\sum\limits_{j=0}^{n-i-2}2^j\\=&\sum\limits_{i=0}^{n-1}(2^i\times(2^{n-i-1}-1))\\=&\sum\limits_{i=0}^{n-1}(2^{n-1}-2^i)\\=&n2^{n-1}-(2^n-1)\end{aligned}" />   
   
好了，这么一个  <img src="https://latex.codecogs.com/svg.image?\inline&space;O(logn)" title="\inline O(1)" /> 的柿子就出来了  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
cout << (n * ksm(2, n - 1) % mod - (ksm(2, n) + mod - 1) % mod + mod) % mod << endl;
```

<hr>

### 洛谷P4981_父子

#### 🔗
<a href="https://www.luogu.com.cn/problem/P4981"><img src="https://img-blog.csdnimg.cn/7aaa69d40d29470988f7850e33407ecc.png"></a>

#### 💡
整个寝室的关系图很容易看成一棵树  
而且是一棵n个人轮流当根的树  
对于每一个人当祖先，根据prufer编码性质有<img src="https://latex.codecogs.com/svg.image?n^{n-2}" title="n^{n-2}" />种树  
而n个人当祖先就是  
<img src="https://latex.codecogs.com/svg.image?n^{n-2}\times&space;n=n^{n-1}" title="n^{n-2}\times n=n^{n-1}" />

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
const int mod = 1e9 + 9;
inline ll ksm ( ll a, ll b ) {
        ll res = 1;
        while ( b ) {
                if ( b & 1 ) res = res * a % mod;
                a = a * a % mod;
                b >>= 1;
        }
        return res;
}

int main () {
        int cass;
        for ( cin >> cass; cass; cass -- ) {
                int n; cin >> n;
                cout << ksm ( n, n - 1 ) << endl;
        }
        return 0;
}
```

<hr>

### 牛客2022寒假算法基础集训营4G_子序列权值乘积

#### 🔗
<a href="https://ac.nowcoder.com/acm/contest/23479/G"><img src="https://img-blog.csdnimg.cn/636cc7a3d9dd4b898721425de121988e.png"></a>

#### 💡
考虑每个数作为 $min$ 和 $max$ 出现的次数  
分成这么两类  
- 自己这个数在整个序列中只出现一次
- 自己这个数在整个序列中出现任意次
  
对于第一类：  
我们找出比自己大的数的个数设置为 `gre`，比自己小的设置为 `les`  
由于可以选或者不选，所以 $x$ 个数就有 $2^x$ 种方案  
那么这类情况做出的贡献为 $a^{2^{les}}\times a^{2^{gre}}$   
  
对于第二类：  
首先我们自己有 $b$ 个，然后依旧是比自己大的数的个数设置为 `gre`，比自己小的设置为 `les`  
自己至少要选两个，别的选或者不选  
那么贡献为 $a^{(2^b-1-b)\times 2^{les}}\times a^{(2^b-1-b)\times 2^{gre}}$   
  
::: danger
有一个细节是取模的时候指数不应是取 $10^9+7$   
而是根据欧拉降幂取 $\phi(10^9+7)=10^9+6$ 
:::
  
[本题线段树解法请看这里](https://tech.chivas-regal.top/blogs/solution/datastructure/segmenttree.html#%E7%89%9B%E5%AE%A22022%E5%AF%92%E5%81%87%E7%AE%97%E6%B3%95%E5%9F%BA%E7%A1%80%E9%9B%86%E8%AE%AD%E8%90%A54g-%E5%AD%90%E5%BA%8F%E5%88%97%E6%9D%83%E5%80%BC%E4%B9%98%E7%A7%AF)

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
ll a[200005];
const ll mod = 1e9 + 7;
const ll powmod = 1e9 + 6;
inline ll ksm ( ll a, ll b, ll mod = 1e9 + 7 ) { ll res = 1; while ( b ) { if ( b & 1 ) res = res * a % mod; a = a * a % mod; b >>= 1; } return res; }
map<ll, ll> num;

int main () {
        ios::sync_with_stdio(false);
        ll n; cin >> n;
        for ( ll i = 0; i < n; i ++ ) {
                cin >> a[i];
                num[a[i]] ++;
        }
        sort ( a, a + n ); a[n] = 0x3f3f3f3f;
        ll res = 1;
        for ( ll i = 0; i < n; i ++ ) {
                ll les = lower_bound(a, a + n + 1, a[i]) - a;
                ll gre = n - (upper_bound(a, a + n + 1, a[i]) - a);
                res = res * ksm(a[i], ksm(2, les, powmod)) % mod; 
                res = res * ksm(a[i], ksm(2, gre, powmod)) % mod;
        }
        for ( auto i : num ) {
                res = res * ksm(
                                i.first % mod, 
                                (((ksm(2, i.second, powmod) - 1 - i.second) % powmod + powmod) % powmod) * ksm(2, lower_bound(a, a + n + 1, i.first) - a, powmod)
                        ) % mod;
                res = res * ksm(
                                i.first % mod,
                                (((ksm(2, i.second, powmod) - 1 - i.second) % powmod + powmod) % powmod) * ksm(2, n - (upper_bound(a, a + n + 1, i.first) - a), powmod)
                        ) % mod;       
        }
        cout << res << endl;
}
```
<hr>


### 牛客练习赛80B_卷积

#### 🔗
<a href="https://ac.nowcoder.com/acm/problem/218216"><img src="https://img-blog.csdnimg.cn/20210409231427628.png"></a>

#### 💡
既然要mex，那么：  
在i=0时，a[1 ~ (n-1)]*b[1 ~ (n-1)]都可行  
在i=1时，a[0]*b[0 ~ (n-1)]与b[0]*a[0 ~ (n-1)]都可行  
在i=2时，只有a[1]*b[0]和a[0]*b[1]可行  
从i=3开始，任何数都不满足，所以都是0  
而对于区间和时我们只需记录前缀和就行了，相减时要加上一个mod防止结果为负  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
const int maxn = 1e5 + 100;
const ll mod = 998244353;
ll a[maxn];
ll b[maxn];
ll sum_a[maxn] = {0};//a的前缀和
ll sum_b[maxn] = {0};//b的前缀和
ll n;
int main()
{
    scanf("%lld", &n);
    for (int i = 1; i <= n; i++)
        scanf("%lld", &a[i]), sum_a[i] = (sum_a[i - 1] + a[i]) % mod;
    for (int i = 1; i <= n; i++)
        scanf("%lld", &b[i]), sum_b[i] = (sum_b[i - 1] + b[i]) % mod;
    for (int i = 1; i <= n; i++)//这里计数都+1，方便统计sum_a[0]与sum_b[0]
    {
        if (i == 1)
            printf("%lld", (sum_a[n] + mod - sum_a[1]) * (sum_b[n] + mod - sum_b[1]) % mod);
        else if (i == 2)
            printf("%lld",  (a[1] * (sum_b[n] + mod - sum_b[0]+mod-b[2]) % mod + b[1] * (sum_a[n] + mod - sum_a[0]+mod-a[2]) % mod +mod- /*去重*/a[1] * b[1] % mod)%mod);
        else if (i == 3)
            printf("%lld", (a[1] * b[2] % mod + a[2] * b[1] % mod) % mod);
        else
            printf("%lld", 0ll);
        if (i != n)
            printf(" ");
    }
    return 0;
}
```

<hr>

### ABC202D_aabababaa

#### 🔗
<a href="https://atcoder.jp/contests/abc202/tasks/abc202_d?lang=en"><img src="https://img-blog.csdnimg.cn/20210526235513656.png"></a>

#### 💡
拿到这道题  
刚开始我其实是想转化为二进制看变化的  
因为如果把'a'视作1，'b'视作0，每次向后推一个字典序其实就是减去一个数  
但是有很多处理地方不知道怎么办  
放弃了，虽然不对，但不得不说确实是一种好的思维拓展方向  
  
正解来了：  
操作数过大的时候我们考虑跳步  
分析字典序性质  
发现每个位置都有两种存放方式：  
要么存a要么存b  
这取决于k的剩余值  
  
  
这个位置放a是对k没有影响的  
因为k是寻找第几个字典序最小的  
  
而放b的话我们要知道我们跳了几步也就是减了多少个k  
确定方式是假设这里放a（比放b小1）我们后面能构造出的字符串数量  
一想这不是组合数吗？  
我们想在剩下的（a + b - 1）个位置随意放置（a - 1）个'a'  
所以跳的步数是C(a + b - 1, a - 1)  
  
流程：
在k>1时（因为我们字典序从头开始找的，所以要少用一个k）：  
	如果k > C(a + b - 1, a - 1)，那么这一步是可以放'b'来跳步的  
	否则，不能跳步，老老实实放'a'吧  
在最后，我们构造出后面没有构造的最小字符串：先放完a，再放完b  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
ll c[65][35];

inline void get_C(){//杨辉三角构建组合数
        for(int i = 0; i < 65; i ++) c[i][0] = 1;
        for(int i = 0; i < 65; i ++){
                for(int j = 1; j <= i && j < 35; j ++){
                        c[i][j] = c[i - 1][j] + c[i - 1][j - 1];
                }
        }
}


inline void solve(){get_C();
        _ll(a); _ll(b); _ll(k);
        string res;
        while(k > 1){
                if(k > c[b + a - 1][a - 1]){ k -= c[b + a - 1][a - 1]; //可以跳步
                        b --; //放了'b'，b的数量就减1
                        res += "b";
                }else{
                        a --;//放了'a'，a的数量就减1
                        res += "a";
                }
        }
        for(int i = 0; i < a; i ++) res += "a";
        for(int i = 0; i < b; i ++) res += "b";
        cout << res << endl;
}

CHIVAS{
        solve();
        _REGAL;
}
```

<hr>

### AcWing2418_光之大陆

#### 🔗
<a href="https://www.acwing.com/problem/content/2420/"><img src="https://img-blog.csdnimg.cn/d53ef6a1ffcd49de9de5d27840b41ec1.png"></a>

#### 💡
我们先将题意抽象出来  
相当于给定n个点，分成任意块，每块都是个环，让这些环连通  
  
环与环的之间连通可以prufer编码的性质 ^(n-2)直接得到  
问题就是分成块的问题  
对于i个点，我们要考虑每一个点的归属  
我们分成j块，我们考虑k个点的归属  
那么我们要递推i-1个点中选k-1个点： dp[i][j] = (dp[i][j] + dp[i - k][j - 1] * c[i - 1][k - 1]  
因为每一块可以旋转环，所以要乘阶乘  
  
最后统计一下分成1～n块的方案数  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
const int N = 210;
ll g[N];
ll dp[N][N];
ll c[N][N];
ll n, mod;

inline void Pre () {
        for ( int i = 0; i < N; i ++ ) {
                for ( int j = 0; j <= i; j ++ ) {
                        if ( j == 0 ) c[i][j] = 1;
                        else          c[i][j] = (c[i - 1][j] + c[i - 1][j - 1]) % mod;
                } 
        }
        g[1] = 1, g[3] = 3;                                                                                                                     
        for ( int i = 4; i < N; i ++ ) g[i] = g[i - 1] * i % mod;
}

int main () {
        cin >> n >> mod; Pre();
        dp[0][0] = 1;
        for ( int i = 1; i <= n; i ++ ) { // 总共i个点
                for ( int j = 1; j <= i; j ++ ) { // 分成j块
                        for ( int k = 1; k <= i - j + 1; k ++ ) { // 要枚举k个看看怎么分配
                                dp[i][j] = (dp[i][j] + dp[i - k][j - 1] * c[i - 1][k - 1] * g[k] % mod) % mod;
                        }
                }
        }
        ll res = g[n - 1], p = 1; // p: prufer定理后面要乘的数
        for ( int k = 2; k <= n; k ++ ) {
                res = ( res + dp[n][k] * p % mod ) % mod;
                p = p * n % mod;
        }
        cout << res << endl;
}
```

<hr>

### ARC134C_TheMajority

#### 🔗
<a href="https://atcoder.jp/contests/arc134/tasks/arc134_c?lang=en"><img src="https://img-blog.csdnimg.cn/14f2ddf24f6949238483657ed344b023.png"></a>

#### 💡  
可以这样想，要想数字是 $1$ 的球个数严格大于别的数字的球个数  
我们可以先给每一个盒子都铺上数字是 $1$ 的球，然后每往一个盒子里面放一个 $1$ 就跟着放一个别的  
  
那么我们可以将这些球分成两类物品  
数字不是 $1$ 的球和数字是 $1$ 的球两两配对形成物品 $a$ ，有 $\alpha$ 个  
剩余的数字是 $1$ 的球每个都是物品 $b$ ，有 $\beta$ 个   
  
我们要先给每个盒子都铺上物品 $b$ ，不能有空盒子  
对于 [球盒模型情况四](https://tech.chivas-regal.top/blogs/algorithm/math/ballandbox.html#%E8%AF%81%E6%98%8E%E5%9B%9B)，方案数为 $\begin{pmatrix}\alpha-1\\\beta-1\end{pmatrix}$  
之后对于物品 $b$ ，注意同数字的球之间是相同的，而不同数字的球是不同的，放置的时候盒可空  
那么我们要对于每一个 $i$ 和 $1$ 拼接物品的数量 $a_i$ 计算一次 [球盒模型情况三](https://tech.chivas-regal.top/blogs/algorithm/math/ballandbox.html#%E8%AF%81%E6%98%8E%E4%B8%89)，方案数为 $\prod\limits_{i=2}^n\begin{pmatrix}a_i+m-1\\m-1\end{pmatrix}$  
  
故答案为  
$$\begin{pmatrix}\alpha-1\\\beta-1\end{pmatrix}\prod\limits_{i=2}^n\begin{pmatrix}a_i+m-1\\m-1\end{pmatrix}$$  


另外，对于 $m$ 比较小但是 $n$ 比较大的组合数，我们可以用分子分母约分之后的方式进行计算  

```cpp
inline ll C ( ll n, ll m ) {
        ll res = 1;
        for ( ll i = 0; i < m; i ++ ) res = res * (n - i) % mod;
        return res * inv[m] % mod;
}
```

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
const int N = 1e5 + 10;
const int K = 210;
const int mod = 998244353;

ll inv[N];

inline ll Ksm ( ll a, ll b ) { ll res = 1; while ( b ) { if ( b & 1 ) res = res * a % mod; a = a * a % mod; b >>= 1; } return res; }
inline ll Inv ( ll x ) { return Ksm(x, mod - 2); }
inline void get_I () {
        inv[0] = Inv(1);
        for ( int i = 1; i < K; i ++ ) 
                inv[i] = inv[i - 1] * Inv(i) % mod;
}
inline ll C ( ll n, ll m ) {
        ll res = 1;
        for ( ll i = 0; i < m; i ++ ) res = res * (n - i) % mod;
        return res * inv[m] % mod;
}

ll n, k;
ll a[N];
ll one, els; // 数字1的个数，别的数字的个数
ll res;
int main () {
        get_I();
        ios::sync_with_stdio(false);

        cin >> n >> k;
        for ( int i = 1; i <= n; i ++ ) {
                cin >> a[i];
                if ( i == 1 ) one += a[i];
                else els += a[i];
        }
        if ( one - els < k ) {
                cout << 0 << endl;
                return 0;
        }

        res = C(one - els - 1, k - 1);
        for ( int i = 2; i <= n; i ++ ) res = res * C(a[i] + k - 1, k - 1) % mod;
        cout << res << endl;
}
```
<hr>

### ARC136B_TripleShift

#### 🔗
<a href="https://atcoder.jp/contests/arc136/tasks/arc136_b?lang=en">![20220303014137](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20220303014137.png)</a>

#### 💡
考虑进行一次操作会产生什么影响  
三个不同的数数往后转一次  
逆序对 $\pm2$  
三个数存在两个相同的  
逆序对改变可以包揽所有的  
  
那么考虑两个数组的逆序对奇偶即可  
同奇偶性必然可以  
不同奇偶性若存在相同的数也可以  
否则不行  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
int n;
int a[5010], b[5010];
int numa[5010];
int mxnum = 0;
 
int main () {
        ios::sync_with_stdio(false);
 
        cin >> n;
        for ( int i = 1; i <= n; i ++ ) cin >> a[i], numa[a[i]] ++, mxnum = max(mxnum, numa[a[i]]);
        for ( int i = 1; i <= n; i ++ ) {
                cin >> b[i];
                if ( numa[b[i]] == 0 ) {
                        cout << "No" << endl;
                        return 0;
                }
                numa[b[i]] --;
        }
        int reva = 0;
        for ( int i = 1; i <= n; i ++ ) {
                for ( int j = 1; j < i; j ++ ) {
                        reva += a[j] > a[i];
                }
        }
        int revb = 0;
        for ( int i = 1; i <= n; i ++ ) {
                for ( int j = 1; j < i; j ++ ) {
                        revb += b[j] > b[i];
                }
        }
        if ( reva % 2 == revb % 2 || mxnum >= 2 ) {
                cout << "Yes" << endl;
        } else {
                cout << "No" << endl;
        }
}
```
<hr>



### CodeForces1536B_AdvertisingAgency

#### 🔗
<a href="https://codeforces.com/problemset/problem/1536/B"><img src="https://img-blog.csdnimg.cn/20210410211951223.png"></a>

#### 💡
我们从上向下取数，最多能取的个数取决于：我们需要多少个跟第k个数相等的数ned、跟第k个数相等的数的个数num。  
这两个得到还是比较容易的，就考验了写码的严谨性，而这个个数明显是组合数，值为(num!) / (ned!) / ((num-ned)!)并取模  
解组合数有两种方式：  
1.杨辉三角递推法（1000*1000）的时间复杂度  
2.在结果上做运算：**求逆元**  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
const ll mod = 1e9 + 7;
int cass;
ll n, k;

ll qpow(ll a,ll b){//ksm
    ll ans = 1;
    while(b){
        if(b&1)
            ans = ans * a % mod;
        a = a * a % mod;
        b >>= 1;
    }
    return ans%mod;
}

ll Inv(ll a,ll p){//逆元
    return qpow(a, p - 2);
}

void solve(){
    vector<ll> vec;
    cin >> n >> k;
    for (int i = 0,x; i < n; i++){
        cin >> x;
        vec.push_back(x);
    }
    sort(vec.begin(), vec.end(), greater<ll>());//合并出最大数，就要降序int cur = k;
    map<int, ll> mp;//mp[i]表i的出现次数
    for (int i = 0; i < vec.size(); i++)
    {
        if(mp[vec[i]]==0)
            mp[vec[i]] = 1;
        else
            mp[vec[i]]++;
    }
    k--;//我们从0开始存的，第k个的下标为k-1
    ll num = mp[vec[k]];//第k个数有多少个
    ll ned = 0;//我们需要多少个第k个数
    for (int i = k; i >= 0; i--){
        if(i==0||vec[i]!=vec[i-1]){
            ned = k - i + 1;
            break;
        }
    }

    //前面的小坑结束了，开始组合数取模
    ll on = 1;//分子
    for (int i = ned + 1; i <= num; i++)
        on = on * i % mod;
    ll dn = 1;//分母
    for (int i = 1; i <= num - ned; i++)
        dn = dn * i % mod;
    cout << on * Inv(dn, mod) % mod << endl;
}

int main()
{
    each_cass(cass){
        solve();
    }
    return 0;
}
```

<hr>

### CodeForces1557C_MoamenAndXOR

#### 🔗
<a href="https://codeforces.com/problemset/problem/1557/C"><img src="https://i.loli.net/2021/09/13/7RtnEshvGNxBioz.png"></a>

#### 💡
首先把整个<img src="https://latex.codecogs.com/svg.image?n" title="n" />个k位数画成一个<img src="https://latex.codecogs.com/svg.image?n\times&space;k" title="n\times k" />的矩阵  
然后对于每一列，也就是<img src="https://latex.codecogs.com/svg.image?n" title="n" />个数的每一位  
如果全<img src="https://latex.codecogs.com/svg.image?1" title="1" />了话<img src="https://latex.codecogs.com/svg.image?\And&space;=1" title="\And =1" />，有一个<img src="https://latex.codecogs.com/svg.image?0" title="0" />就是<img src="https://latex.codecogs.com/svg.image?0" title="0" />。  
偶数个<img src="https://latex.codecogs.com/svg.image?1" title="1" />了话<img src="https://latex.codecogs.com/svg.image?\bigoplus&space;=0" title="\bigoplus =0" />，奇数个<img src="https://latex.codecogs.com/svg.image?\bigoplus&space;=1" title="\bigoplus =1" />  
  
得到两条性质：  
**n为奇数时：** 这一位最多在含有偶数个<img src="https://latex.codecogs.com/svg.image?1" title="1" />的时候与和异或相等，都是<img src="https://latex.codecogs.com/svg.image?0" title="0" />  
**n为偶数时：** 这一位在全<img src="https://latex.codecogs.com/svg.image?1" title="1" />时，<img src="https://latex.codecogs.com/svg.image?\And&space;=1" title="\And =1" />，<img src="https://latex.codecogs.com/svg.image?\bigoplus&space;=0" title="\bigoplus =0" />。而在全<img src="https://latex.codecogs.com/svg.image?1" title="1" />以下的偶数个时，<img src="https://latex.codecogs.com/svg.image?\And&space;=\bigoplus&space;=0" title="\And =\bigoplus =0" />  
  
那么有两类解决方案：  
**n为奇数时：**   
每一位最多只能相等，就是在每一位都有偶数个<img src="https://latex.codecogs.com/svg.image?1" title="1" />或者全<img src="https://latex.codecogs.com/svg.image?1" title="1" />的情况下  
所以我们对每一位的n个数字进行排列组合，设偶数个<img src="https://latex.codecogs.com/svg.image?1" title="1" />和全<img src="https://latex.codecogs.com/svg.image?1" title="1" />的组合情况累加为<img src="https://latex.codecogs.com/svg.image?has\_Eve&plus;1" title="has\_Eve+1" />    
那么答案就是  
<img src="https://latex.codecogs.com/svg.image?(has\_Eve&plus;1)^k" title="(has\_Eve+1)^k" />   
**n为偶数时：**  
每一位可以是相等，就是在每一位在非全<img src="https://latex.codecogs.com/svg.image?1" title="1" />且有偶数个的情况下，设为<img src="https://latex.codecogs.com/svg.image?has\_Eve" title="has\_Eve" />  
当前位还可以大于，就是在这一位(设为<img src="https://latex.codecogs.com/svg.image?i" title="i" />)全<img src="https://latex.codecogs.com/svg.image?1" title="1" />的情况下，那么前面的所有位都可以任意个<img src="https://latex.codecogs.com/svg.image?\And&space;=1" title="\And =1" />组合，方案有<img src="https://latex.codecogs.com/svg.image?(2^n)^{i-1}" title="(2^n)^{i-1}" />个  
所以这一位就是要递推，答案是  
<img src="https://latex.codecogs.com/svg.image?\begin{aligned}i\{1\to&space;k\}:\\&res=res\times&space;has\_Eve&space;&plus;&space;(2^n)^{i-1}\end{aligned}" title="\begin{aligned}i\{1\to k\}:\\&res=res\times has\_Eve + (2^n)^{i-1}\end{aligned}" />

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
const int N = 2e5 + 10;
const int mod = 1e9 + 7;
ll f[N];

inline void Get_F () {
        f[0] = 1;
        for ( int i = 1; i < N; i ++ ) 
                f[i] = f[i - 1] * i % mod;
}
inline ll ksm ( ll a, ll b ) {
        ll res = 1;
        while ( b > 0 ) {
                if ( b & 1 ) res = res * a % mod;
                a = a * a % mod;
                b >>= 1;
        }
        return res;
}
inline ll C ( ll a, ll b ) {
        return f[a] * ksm(f[b], mod - 2) % mod * ksm(f[a - b], mod - 2) % mod;
}

inline void solve () {
        ll n, k; cin >> n >> k;

        ll has_Eve = 0; for ( ll i = 0; i < n; i += 2 ) has_Eve = (has_Eve + C(n, i)) % mod;
        if ( n & 1 ) {
                cout << ksm ( has_Eve + 1, k) << endl; // 每一位都是要么选偶数个要么全选，只有这样才能相等
        } else {
                ll res = 1;
                for ( ll i = 1; i <= k; i ++ ) {
                        res = res * has_Eve % mod;                 // 第i位不全是1 -- 前一位满足的方案数乘它
                        res = (res + ksm(ksm(2, n), i - 1)) % mod; // 第i位全是1 -- 前面的可以随意搞
                }
                cout << res << endl;
        }
}

int main () {
#ifndef ONLINE_JUDGE
        freopen("in.in", "r", stdin);
        freopen("out.out", "w", stdout);
#endif
        Get_F();
        int cass;
        for ( cin >> cass; cass; cass -- ) {
                solve();
        }
}
```

<hr>

### CodeForces1594B_SpecialNumbers

#### 🔗
<a href="https://codeforces.com/contest/1594/problem/B"><img src="https://i.loli.net/2021/10/09/RMkqpLPQY5TFEr1.png"></a>

#### 💡
对一个b进行分割  
首先看一下按顺序的排列情况：  
0 (1)  
1 0+1 (2)   
2 0+2 1+2 0+1+2 (4)   
3 0+3 1+3 2+3 0+1+3 0+2+3 1+2+3 0+1+2+3 (8)  
...  
首先想到对b进行查找，看看是存在于哪一组（设为bas）中  
然后`b -= (1ll << bas)`  
可以发现剩下的也就是被拆过之后的值，可以继续进行分割，然后查找  
那么每次 `res` 也就是加上 a^bas，直到b被拆到0  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
const int mod = 1e9 + 7;

inline ll ksm ( ll a, ll b ) {
	ll res = 1;
	while ( b ) {
		if ( b & 1 ) res = res * a % mod;
		a = a * a % mod;
		b >>= 1;
	}
	return res;
}

inline void Solve() {
	ll a, b; cin >> a >> b;
	ll res = 0;
	while ( b > 0 ) {
		ll bas = 0, sum = 0;
		while ( sum + (1ll << bas) < b ) {
			sum += (1ll << bas);
			bas ++;
		}
		res = (res + ksm(a, bas)) % mod;
		b -= (1ll << bas);
	}
	cout << res << endl;

}

int main () {
	int cass; cin >> cass; while ( cass -- ) {
		Solve();
	}
        return 0;
}
```

<hr>

### CodeForces1594E1_Rubik'sCubeColoring(easyversion)

#### 🔗
<a href="https://codeforces.com/contest/1594/problem/E1"><img src="https://i.loli.net/2021/10/09/D1sUwZuREFK5rkV.png"></a>

#### 💡
首先应该能很快想到，只有祖先节点有6种颜色可以选，那么对于每个有父节点的节点，他们都只能选四个  
一共有<img src="https://latex.codecogs.com/svg.image?2^k-1" title="2^k-1" />个节点  
那么答案公式就是<img src="https://latex.codecogs.com/svg.image?6\times&space;4^{2^k-2}" title="6\times 4^{2^k-2}" />  
  
此时k不过60所以我们也没有必要用快速幂求指数  
如果非要用的话，模数要选择<img src="https://latex.codecogs.com/svg.image?10^9&plus;6" title="10^9+6" />，因为根据欧拉定理，指数取模时在<img src="https://latex.codecogs.com/svg.image?gcd(up,&space;mod)=1" title="gcd(up, mod)=1" />时要取<img src="https://latex.codecogs.com/svg.image?\phi(mod)" title="\phi(mod)" />

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
const int mod = 1e9 + 7;

inline ll ksm ( ll a, ll b ) {
	ll res = 1;
	while ( b ) {
		if ( b & 1 ) res = res * a % mod;
		a = a * a % mod;
		b >>= 1;
	}
	return res;
}

int main () {
	ll n; cin >> n;
	cout << 6 * ksm(4, (1ll << n) - 2) % mod << endl;
        return 0;
}
```

<hr>

### CodeForces1644D_CrossColoring

#### 🔗
<a href="https://codeforces.com/contest/1644/problem/D"><img src="https://img-blog.csdnimg.cn/e9a42398e1094cf1815b59ef9ee1d3ab.png"></a>

#### 💡
这个是要能对结果进行分区再组合  
求出我们可以向下移动的次数 `can_dwn` 和可以向右移动的次数 `can_rgt`  

首先我们要找到真正可以移动的部分  
即 $s[i]!=s[i+1]$ 的位置（第一个拐角  
先求出彻底包含第一个拐角之后的路径的行数 `r` 和列数 `c`  
那么  
<b>第一个部分</b>是我们一直向右移动可以多覆盖的面积：$can\_rgt\times c$  
<b>第二个部分</b>是我们一直向下移动可以多覆盖的面积：$can\_dwn\times r$  
<b>第三个部分</b>是我们开始时覆盖的面积：$s.size()+1$  
<b>第四个部分</b>是我们右下角的面积：$can\_dwn\times can\_rgt$  

将这四部分加在一起即可  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
inline void Solve () {
        int n; cin >> n; n --;
        string s; cin >> s;
        ll rgt = 0, dwn = 0;
        for ( int i = 0; i < s.size(); i ++ ) {
                rgt += s[i] == 'R';
                dwn += s[i] == 'D';
        }
        ll canr = n - rgt;
        ll cand = n - dwn;
 
        string tmp = s; sort ( tmp.begin(), tmp.end() );
        if (tmp[0] == tmp.back()) {
                cout << n + 1 << endl;
                return;
        }
 
        int id = 0;
        for ( int i = 0; i < s.size(); i ++ ) {
                if ( s[i] != s[i + 1] ) {
                        id = i;
                        break;
                }
        }
        rgt = dwn = 1;
        for ( int i = id + 1; i < s.size(); i ++ ) rgt += s[i] == 'R', dwn += s[i] == 'D';
 
 
        ll dwn_num = rgt * cand;
        ll rgt_num = dwn * canr;
        cout << canr * cand + s.size() + 1 + dwn_num + rgt_num << endl;
}
```
<hr>

## CodeForces1649E_TylerAndStrings

#### 🔗
<a href="https://codeforces.com/contest/1649/problem/E">![20220308115240](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20220308115240.png)</a>

#### 💡
考虑一个没有任何限制的情况  
若存在 $cnt[i]$ 个 $i$ ，构造出不同的数列的方案数 $=\frac{(\sum\limits_{i=1}^Ncnt[i])!}{\prod\limits_{i=1}^Ncnt[i]!}$  
这里我们要让字典序 $a<b$  
那么也就是说必须要含一串相同的前缀，然后对于第一个非前缀的位置，让 $a[i]<b[i]$  
枚举从第 $i$ 个为第一个非同前缀的位置  
- 前面由于相同，方案数为 $1$ 
- 第 $i$ 个位置可以选的数的个数为小于 $b[i]$ 的数的个数 
- 后面可以随意排列，为 $(n-i)!$
- 最后要除 $\prod\limits_{i=1}^Ncnt[i]!$

考虑一个递进的记录，这样可以防止每次我们要重新对每一个数算 $\prod\limits_{i=1}^Ncnt[i]!$ 与 $\sum\limits_{j=1}^{b[i]-1}cnt[j]$  

$ifac,fac$ 都可以提前预处理  
前者可以维护一个 $div\_permutation=\frac{1}{\prod\limits_{i=1}^Ncnt[i]!}$ ，每次使 $cnt[b[i]]-1$ 时意味着要少除一个 $cnt[b[i]]$ ，那么让 $div\_permutation\times cnt[b[i]]$ 即可  
后者可以用树状数组去记录  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
const int N = 2e5 + 10;
const int mod = 998244353;
struct modint{ /*.....*/ };
# define mi modint

int n, m;
int a[N], b[N];
int cnt[N];
 
int t[N];
inline int lowbit ( int x ) { return x & -x; }
inline void Update ( int x, int c ) {
        while ( x < N ) t[x] += c, x += lowbit(x);
}
inline mi Query ( int x ) {
        mi res = 0;
        while ( x > 0 ) res += t[x], x -= lowbit(x);
        return res;
}
 
mi fac[N], ifac[N];
 
int main () {
        fac[0] = ifac[0] = 1;
        for ( int i = 1; i < N; i ++ ) fac[i] = fac[i - 1] * i, ifac[i] = ifac[i - 1] / i;
 
 
        scanf("%d%d", &n, &m);
        for ( int i = 1; i <= n; i ++ ) scanf("%d", &a[i]), cnt[a[i]] ++, Update(a[i], 1);
        for ( int i = 1; i <= n; i ++ ) scanf("%d", &b[i]);
 
        mi div_permutation = 1;
        for ( int i = 1; i < N; i ++ ) div_permutation *= ifac[cnt[i]];
 
        mi res = 0;
        bool flag = true;
        for ( int i = 1; i <= min(n, m); i ++ ) {
                res += Query(b[i] - 1) * fac[n - i] * div_permutation;
                div_permutation *= cnt[b[i]];
                cnt[b[i]] --;
 
                if ( cnt[b[i]] < 0 ) {
                        flag = false;
                        break;
                }
 
                Update(b[i], -1);
        }       
        if ( flag && n < m ) res += 1;
 
        printf("%d", res);
}
```
<hr>


### ICPC2020上海站G_Fibonacci

#### 🔗
<a href="https://codeforces.com/gym/102900/problem/G"><img src="https://img-blog.csdnimg.cn/cfad2ab416f3422e86ca29dcbcd0cc6b.png"></a>

#### 💡
fibonacci数列每第三个数一定是偶数  
那么 `n/3` 求一下偶数的个数 `eve` 
偶数和所有数相乘都是偶数 `res = eve * n` 但是不能和自己组合 `res -= eve`  
偶数内部两两组合也多加了一次，要减去 `res -= eve * (eve - 1) / 2`  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
int main () {
        ios::sync_with_stdio(false);

        ll n; cin >> n;
        ll eve = n / 3;
        ll res = eve * n - eve;
        res -= eve * (eve - 1) / 2;
        cout << res << endl;
}
```

<hr>

### POJ3734_Blocks

#### 🔗
<a href="https://ac.nowcoder.com/acm/contest/24710/D"><img src="https://i.loli.net/2021/11/25/t2savw1RVIrTjGd.png"></a>

#### 💡
首先生成函数想一波，把这四个砖的生成函数乘起来得到  <img src="https://latex.codecogs.com/svg.image?\inline&space;\frac{1}{(1-x)^4(1+x)^2}" title="\inline \frac{1}{(1-x)^4(1+x)^2}" />  发现啥也不啥，告辞  
组合数想一波  
其实就是分成两部分，一部分一定是偶数，一部分无所谓，偶数那一部分分成两份偶数，无所谓那一部分分成两份无所谓  
 <img src="https://latex.codecogs.com/svg.image?\inline&space;n" title="\inline n" />  块砖选偶数个有  <img src="https://latex.codecogs.com/svg.image?\inline&space;2^{n-1}" title="\inline 2^{n-1}" />  种，选任意个有  <img src="https://latex.codecogs.com/svg.image?\inline&space;2^n" title="\inline 2^n" />  种  
那么从这偶数个中选偶数个，再从另外任意个中选任意个，得到柿子  
 <img src="https://latex.codecogs.com/svg.image?\inline&space;\sum\limits_{i=0}^{\frac&space;n2\times2}(\binom{n}{i}\times2^{i-1}\times2^{n-i})" title="\inline \sum\limits_{i=0}^{\frac n2\times2}(\binom{n}{i}\times2^{i-1}\times2^{n-i})" />   
注意在  <img src="https://latex.codecogs.com/svg.image?\inline&space;i=0" title="\inline i=0" />  时  <img src="https://latex.codecogs.com/svg.image?\inline&space;2^{i-1}" title="\inline 2^{i-1}" />  可能会出错，所以拿出来  
 <img src="https://latex.codecogs.com/svg.image?\inline&space;\begin{aligned}&\sum\limits_{i=0}^{\frac&space;n2\times2}(\binom{n}{i}\times2^{i-1}\times2^{n-i})\\=&\sum\limits_{i=2}^{\frac&space;n2\times2}(\binom{n}{i}\times2^{i-1}\times2^{n-i})+2^n\\=&2^{n-1}\sum\limits_{i=2}^{\frac&space;n2\times2}\binom{n}{i}+2^n\\=&2^{n-1}\times(2^{n-1}-1)+2^n\end{aligned}" title="\inline \begin{aligned}&\sum\limits_{i=0}^{\frac n2\times2}(\binom{n}{i}\times2^{i-1}\times2^{n-i})\\=&\sum\limits_{i=2}^{\frac n2\times2}(\binom{n}{i}\times2^{i-1}\times2^{n-i})+2^n\\=&2^{n-1}\sum\limits_{i=2}^{\frac n2\times2}\binom{n}{i}+2^n\\=&2^{n-1}\times(2^{n-1}-1)+2^n\end{aligned}" />   
  
我们解这个柿子就行了  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
const int mod = 10007;

inline ll ksm ( ll a, ll b ) {
        ll res = 1;
        while ( b ) {
                if ( b & 1 ) res = res * a % mod;
                a = a * a % mod;
                b >>= 1;
        }
        return res;
}

int main () {
        int cass; cin >> cass; while ( cass -- ) {
               ll n; cin >> n;
               ll two_mi = ksm(2, n - 1);
               cout << (two_mi * (two_mi - 1) % mod + two_mi * 2 % mod) % mod << endl;
        }
}
```

<hr>

## 生成函数

### 洛谷P6078_Sweets

#### 🔗
<a href="https://www.luogu.com.cn/problem/P6078"><img src="https://i.loli.net/2021/11/25/WNiCvjUeZGQRs69.png"></a>

#### 💡
先根据题目构建生成函数  
 <img src="https://latex.codecogs.com/svg.image?\inline&space;i:1+x+x^2+...+x^{m_i}" title="\inline i:1+x+x^2+...+x^{m_i}" />   
将生成函数乘起来  <img src="https://latex.codecogs.com/svg.image?\inline&space;\prod\limits_{i=1}^n\frac{1-x^{m_i+1}}{1-x}=\frac{\prod\limits_{i=1}^n(1-x(m_i+1))}{(1-x)^n}" title="\inline \prod\limits_{i=1}^n\frac{1-x^{m_i+1}}{1-x}=\frac{\prod\limits_{i=1}^n(1-x(m_i+1))}{(1-x)^n}" />   
上面的可以变成一个多项式  <img src="https://latex.codecogs.com/svg.image?\inline&space;g(x)" title="\inline g(x)" />   
看下面的   
 <img src="https://latex.codecogs.com/svg.image?\inline&space;\begin{aligned}&=(1-x)^{-n}\\&=\sum\limits_{i\ge0}\binom{-n}i(-x)^i\\&=\sum\limits_{i\ge0}\frac{(-n)\times...\times(-n-i+1)}{i!}(-x)^i\\&=\sum\limits_{i\ge0}\frac{n\times...\times(n+i-1)}{i!}x^i\\&=\sum\limits_{i\ge0}\binom{n+i-1}ix^i\end{aligned}" title="\inline \begin{aligned}=(1-x)^{-n}\\=\sum\limits_{i\ge0}\binom{-n}i(-x)^i\\=\sum\limits_{i\ge0}\frac{(-n)\times...\times(-n-i+1)}{i!}(-x)^i\\=\sum\limits_{i\ge0}\frac{n\times...\times(n+i-1)}{i!}x^i\\=\sum\limits_{i\ge0}\binom{n+i-1}ix^i\end{aligned}" />   
合并起来得到  <img src="https://latex.codecogs.com/svg.image?\inline&space;g(x)\sum\limits_{i\ge0}\binom{n+i-1}ix^i" title="\inline g(x)\sum\limits_{i\ge0}\binom{n+i-1}ix^i" />   
  
对于  <img src="https://latex.codecogs.com/svg.image?\inline&space;x^k" title="\inline x^k" />  这一项：（系数设置为  <img src="https://latex.codecogs.com/svg.image?\inline&space;\alpha" title="\inline \alpha" />  )  <img src="https://latex.codecogs.com/svg.image?\inline&space;\alpha&space;x^k\sum\limits_{l\le&space;i+1\le&space;r}\binom{n+i-1}{i}x^i" title="\inline \alpha x^k\sum\limits_{l\le i+1\le r}\binom{n+i-1}{i}x^i" />   
那么这一项贡献为  <img src="https://latex.codecogs.com/svg.image?\inline&space;\alpha\sum\limits_{i=l-k}^{r-k}\binom{n+i-1}{i}" title="\inline \alpha\sum\limits_{i=l-k}^{r-k}\binom{n+i-1}{i}" />   
由  <img src="https://latex.codecogs.com/svg.image?\inline&space;\binom{n}{m}=\binom{n}{m-1}+\binom{n-1}{m-1}" title="\inline \binom{n}{m}=\binom{n}{m-1}+\binom{n-1}{m-1}" />  可将  <img src="https://latex.codecogs.com/svg.image?\inline&space;\sum\limits_{i=l-k}^{r-k}\binom{n+i-1}{i}" title="\inline \sum\limits_{i=l-k}^{r-k}\binom{n+i-1}{i}" />  化成  <img src="https://latex.codecogs.com/svg.image?\inline&space;\binom{r-k+n}{r-k}-\binom{l-k+n-1}{l-k-1}" title="\inline \binom{r-k+n}{r-k}-\binom{l-k+n-1}{l-k-1}" />   
即  <img src="https://latex.codecogs.com/svg.image?\inline&space;\alpha(\binom{r+k-n}{r-k}-\binom{l-k+n-1}{l-k-1})" title="\inline \alpha(\binom{r+k-n}{r-k}-\binom{l-k+n-1}{l-k-1})" />   

那么答案为  <img src="https://latex.codecogs.com/svg.image?\inline&space;\sum\limits_{i=1}^{SZ_g}\alpha_i(\binom{r+k_i-n}{r-k_i}-\binom{l-k_i+n-1}{l-k_i-1})" title="\inline \sum\limits_{i=1}^{SZ_g}\alpha_i(\binom{r+k_i-n}{r-k_i}-\binom{l-k_i+n-1}{l-k_i-1})" />   

对于取模，观察  <img src="https://latex.codecogs.com/svg.image?\inline&space;\binom{x+n}{x}=\frac{(n+1)\times...\times(n+x)}{n!}" title="\inline \binom{x+n}{x}=\frac{(n+1)\times...\times(n+x)}{n!}" />   
将  <img src="https://latex.codecogs.com/svg.image?\inline&space;mod+n!" title="\inline mod+n!" />  ，取完模是比  <img src="https://latex.codecogs.com/svg.image?\inline&space;n!" title="\inline n!" />  要大的，那么这时就可以直接除  <img src="https://latex.codecogs.com/svg.image?\inline&space;n!" title="\inline n!" />  了  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
int n, a, b;
int m[15];
map<int, int> g_mps;
vector<pair<int, int> > g; // first: 指数，second: 系数

const int mod = 2004;
ll MOD = mod;
ll fac = 1;
inline int C ( int n, int m ) {
        if ( n < m ) return 0;
        ll res = 1;
        for ( int i = n - m + 1; i <= n; i ++ ) res = res * i % MOD;
        return res / fac % mod;
}

int main () {
        cin >> n >> a >> b;
        for ( ll i = 1; i <= n; i ++ ) fac *= i;
        MOD *= fac;

        g_mps[0] = 1;
        for ( int i = 0; i < n; i ++ ) {
                cin >> m[i];
                vector<pair<int, int> > tmps; 
                for ( auto g_mp : g_mps ) {
                        tmps.push_back({g_mp.first, g_mp.second});
                        tmps.push_back({g_mp.first + m[i] + 1, -g_mp.second});
                }
                g_mps.clear();
                for ( auto tmp : tmps ) {
                        g_mps[tmp.first] += tmp.second;
                }
        }
        for ( auto g_mp : g_mps ) g.push_back({g_mp.first, g_mp.second});

        ll res = 0;
        for ( auto i : g ) {
                int k = i.first;
                res = ((res + (ll)i.second * (C(n + b - k, n) - C(n + a - k - 1, n) + mod) % mod) % mod + mod) % mod;
        }
        cout << res << endl;
}
```

<hr>

### 牛客NC207746_背包

#### 🔗
<a href="https://ac.nowcoder.com/acm/contest/24710/A"><img src="https://i.loli.net/2021/11/24/KcP56J1EIiOuRFf.png"></a>

#### 💡
我们对每一个物品一个生成函数多项式，同时根据下面这个结论将他们化简     
>对于等比  <img src="https://latex.codecogs.com/svg.image?\inline&space;(x)" title="\inline (x)" />  数列求和公式：  <img src="https://latex.codecogs.com/svg.image?\inline&space;\frac{a_0(1-x^n)}{1-x}" title="\inline \frac{a_0(1-x^n)}{1-x}" />   
>如果   <img src="https://latex.codecogs.com/svg.image?\inline&space;(0<x<1)" title="\inline (1\lt&space;x\lt y)" />  
>那么  <img src="https://latex.codecogs.com/svg.image?\inline&space;1-x^n\approx1" title="\inline 1-x^n\approx1" />   
>所以  <img src="https://latex.codecogs.com/svg.image?\inline&space;\frac{a_0(1-x^n)}{1-x}\approx\frac1{x-1}" title="\inline \frac{a_0(1-x^n)}{1-x}\approx\frac1{x-1}" /> 

 <img src="https://latex.codecogs.com/svg.image?\inline&space;\begin{aligned}(1)&1+x&1+x\\(2)&1+x+x^2&\frac{1-x^3}{1-x}\\(3)&1+x+x^2+x^3&\frac{1-x^4}{1-x}\\(4)&1+x^2+x^4+...&\frac{1}{1-x^2}\\(5)&x+x^3+x^5+...&\frac{x}{1-x^2}\\(6)&1+x^4+x^8+...&\frac{1}{1-x^4}\\(7)&1+x&1+x\\(8)&x+x^3+x^6+...&\frac1{1-x^3}\end{aligned}" title="\inline \begin{aligned}(1)&1+x&1+x\\(2)&1+x+x^2&\frac{1-x^3}{1-x}\\(3)&1+x+x^2+x^3&\frac{1-x^4}{1-x}\\(4)&1+x^2+x^4+...&\frac{1}{1-x^2}\\(5)&x+x^3+x^5+...&\frac{x}{1-x^2}\\(6)&1+x^4+x^8+...&\frac{1}{1-x^4}\\(7)&1+x&1+x\\(8)&x+x^3+x^6+...&\frac1{1-x^3}\end{aligned}" />    

对后面的求和并化简得到  <img src="https://latex.codecogs.com/svg.image?\inline&space;g(x)=\frac{x}{(1-x)^4}" title="\inline g(x)=\frac{x}{(1-x)^4}" />   
展开得  <img src="https://latex.codecogs.com/svg.image?\inline&space;g(x)=x\times&space;(\frac1{1-x})^4=x(1+x+x^2+x^3+...+x^n)^4" title="\inline g(x)=x\times (\frac1{1-x})^4=x(1+x+x^2+x^3+...+x^n)^4" />   
根据二项式定理得到最后  <img src="https://latex.codecogs.com/svg.image?\inline&space;x^n" title="\inline x^n" />  的系数便是  <img src="https://latex.codecogs.com/svg.image?\inline&space;\binom{n+2}{n-1}" title="\inline \binom{n+2}{n-1}" />   
   
那么就直接求  <img src="https://latex.codecogs.com/svg.image?\inline&space;\frac{n\times(n+1)\times(n+2)}{1\times2\times3}" title="\inline \frac{n\times(n+1)\times(n+2)}{1\times2\times3}" />   


#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
const int mod = 1e9 + 7;
inline ll ksm ( ll a, ll b ) {
        ll res = 1;
        while ( b ) {
                if ( b & 1 ) res = res * a % mod;
                a = a * a % mod;
                b >>= 1;
        }
        return res;
}
inline ll inv ( ll x ) {
        return ksm ( x, mod - 2 );
}

int main () {
        ll n; cin >> n;
        ll a = n % mod, b = (n + 1) % mod, c = (n + 2) % mod;
        ll d = inv(6);
        cout << a * b % mod * c % mod * d % mod << endl;
}
```

<hr>

### HDUOJ1521_排列组合

#### 🔗
http://acm.hdu.edu.cn/showproblem.php?pid=1521

#### 💡


#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >  
  

```cpp
#include <algorithm>
#include <iostream>
#include <cstring>
#include <string>
#include <vector>
#include <cstdio>
#include <stack>
#include <queue>
#include <cmath>
#include <map>
#include <set>
#define G 10.0
#define LNF 1e18
#define eps 1e-6
#define ll long long
#define INF 0x7FFFFFFF
#define Chivas int main()
#define Regal return 0
#define PI acos(-1.0)
#define pb(x) push_back(x)
#define SP system("pause")
#define mm(a, b) memset(a, b, sizeof(a))
#define fir(i, a, n) for (ll i = a; i <= n; i++)
#define rif(i, a, n) for (ll i = a; i >= n; i--)
#define each_cass(cass) for (scanf("%d", &cass); cass; cass--)

using namespace std;

const int maxn = 15;
double c1[maxn], c2[maxn];
ll num[maxn];
ll F[maxn];
ll n, m;

void Factorial(){
    F[0] = 1;
    for (int i = 1; i < maxn; i++)
        F[i] = F[i - 1] * i;
}

void init(){
    mm(c1, 0);
    mm(c2, 0);
    for (int i = 0; i <= num[1]; i++)
        c1[i] = 1.0 / F[i];
}

Chivas{
    Factorial();
    while (scanf("%lld%lld", &n, &m) == 2){
        for (int i = 1; i <= n; i++)
            scanf("%lld", &num[i]);
        init();
        for (int i = 2; i <= n; i++){
            for (int j = 0; j <= m; j++){
                for (int k = 0; k + j <= m && k <= num[i]; k++)
                    c2[j + k] += c1[j] / F[k];
            }
            for (int j = 0; j <= m; j++)
                c1[j] = c2[j], c2[j] = 0;
        }
        printf("%.0f\n", c1[m] * F[m]);
    }
    Regal;
}
```

<hr>

### HDUOJ1028_IgnatiusAndThePrincess3

#### 🔗
http://acm.hdu.edu.cn/showproblem.php?pid=1028

#### 💡


#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >  
  

```cpp
#include <algorithm>
#include <iostream>
#include <cstring>
#include <string>
#include <vector>
#include <cstdio>
#include <stack>
#include <queue>
#include <cmath>
#include <map>
#include <set>
#define G 10.0
#define LNF 1e18
#define eps 1e-6
#define ll long long
#define INF 0x7FFFFFFF
#define PI acos(-1.0)
#define pb(x) push_back(x)
#define SP system("pause")
#define mm(a, b) memset(a, b, sizeof(a))
#define fir(i, a, n) for (int i = a; i <= n; i++)
#define rif(i, a, n) for (int i = a; i >= n; i--)
#define each_cass(cass) for (cin >> cass; cass; cass--)

using namespace std;

const int maxn = 200;
int c1[maxn];
int c2[maxn];

void init(){
    for (int i = 0; i < maxn; i++)
        c1[i] = 1, c2[i] = 0;
}

int main(){
    int n;
    while(cin>>n){
        init();
        for (int i = 2; i <= n; i++){//n-1次合并
            for (int j = 0; j <= n; j++)//第一个括号
                for (int k = 0; k + j <= n; k += i)//第二个括号
                    c2[j + k] += c1[j];
            for (int j = 0; j <= n; j++)//替换
                c1[j] = c2[j], c2[j] = 0;
        }
        cout << c1[n] << endl;
    }
    return 0;
}
```

<hr>

### HDUOJ1085_HoldingBin-LadenCaptive

#### 🔗
http://acm.hdu.edu.cn/showproblem.php?pid=1085

#### 💡


#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >  
  

```cpp
#include <algorithm>
#include <iostream>
#include <cstring>
#include <string>
#include <vector>
#include <cstdio>
#include <stack>
#include <queue>
#include <cmath>
#include <map>
#include <set>
#define G 10.0
#define LNF 1e18
#define eps 1e-6
#define ll long long
#define INF 0x7FFFFFFF
#define PI acos(-1.0)
#define pb(x) push_back(x)
#define SP system("pause")
#define mm(a, b) memset(a, b, sizeof(a))
#define fir(i, a, n) for (ll i = a; i <= n; i++)
#define rif(i, a, n) for (ll i = a; i >= n; i--)
#define each_cass(cass) for (scanf("%d", &cass); cass; cass--)

using namespace std;

const int maxn = 100010;
int kind[4] = {0, 1, 2, 5};
int c1[maxn];
int c2[maxn];
int num[4];
int sum;

void init(){
    mm(c1, 0);
    mm(c2, 0);
    for (int i = 0; i <= sum; i++)
        c1[i] = 1, c2[i] = 0;
}

int main(){
    while (scanf("%d%d%d", &num[1], &num[2], &num[3]) == 3, num[1] || num[2] || num[3]){
        sum = num[1];
        init();
        for (int i = 2; i <= 3; i++){
            for (int j = 0; j <= sum; j++)
                for (int k = 0; k <= num[i] * kind[i]; k += kind[i])
                    c2[j + k] += c1[j];
            sum += num[i] * kind[i];
            for (int j = 0; j <= sum; j++)
                c1[j] = c2[j], c2[j] = 0;
        }
        for (int i = 0; i <= sum + 1; i++){
            if(!c1[i]){
                printf("%d\n", i);
                break;
            }
        }
    }
    return 0;
}

```

<hr>

### HDUOJ1398_SquareCoins

#### 🔗
http://acm.hdu.edu.cn/showproblem.php?pid=1398

#### 💡


#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >  
  

```cpp
#include <algorithm>
#include <iostream>
#include <cstring>
#include <string>
#include <vector>
#include <cstdio>
#include <stack>
#include <queue>
#include <cmath>
#include <map>
#include <set>
#define G 10.0
#define LNF 1e18
#define eps 1e-6
#define ll long long
#define INF 0x7FFFFFFF
#define PI acos(-1.0)
#define pb(x) push_back(x)
#define SP system("pause")
#define mm(a, b) memset(a, b, sizeof(a))
#define each_cass(cass) for (cin >> cass; cass; cass--)

using namespace std;

const ll maxn = 1000;
ll c1[maxn];
ll c2[maxn];
ll a[1000];

void init(){
    for (ll i = 0; i < maxn; i++)
        c1[i] = 1, c2[i] = 0;
    for (ll i = 0; i < 1000; i++)
        a[i] = i * i;
}

int main(){
    ll n;
    while(scanf("%d",&n)==1,n){
        init();
        for (ll i = 2; i <= n; i++){
            for (ll j = 0; j <= n; j++)
                for (ll k = 0; k + j <= n; k += a[i])
                    c2[k + j] += c1[j];
            for (ll j = 0; j <= n; j++)
                c1[j] = c2[j], c2[j] = 0;
        }
        printf("%d\n", c1[n]);
    }
    return 0;
}

```

<hr>

### HDUOJ1709_TheBalance

#### 🔗
http://acm.hdu.edu.cn/showproblem.php?pid=1709

#### 💡


#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >  
  

```cpp
#include <algorithm>
#include <iostream>
#include <cstring>
#include <string>
#include <vector>
#include <cstdio>
#include <stack>
#include <queue>
#include <cmath>
#include <map>
#include <set>
#define G 10.0
#define LNF 1e18
#define eps 1e-6
#define ll long long
#define INF 0x7FFFFFFF
#define PI acos(-1.0)
#define pb(x) push_back(x)
#define SP system("pause")
#define mm(a, b) memset(a, b, sizeof(a))
#define fir(i, a, n) for (ll i = a; i <= n; i++)
#define rif(i, a, n) for (ll i = a; i >= n; i--)
#define each_cass(cass) for (scanf("%d", &cass); cass; cass--)

using namespace std;

const int maxn = 100005;
int n;
int A[110];
int c1[maxn];
int c2[maxn];

void init(){
    mm(c1, 0);
    mm(c2, 0);
    c1[0] = c1[A[1]] = 1;
}

main(){
    while (scanf("%d", &n) == 1){
        int sum = 0;
        for (int i = 1; i <= n; i++)
            scanf("%d", &A[i]), sum += A[i];
        init();
        for (int i = 2; i <= n; i++){
            for (int j = 0; j <= sum; j++){
                for (int k = 0; k + j <= sum && k <= A[i]; k += A[i])
                    c2[abs(k - j)] += c1[j], c2[k + j] += c1[j];
            }
            for (int j = 0; j <= sum; j++)
                c1[j] = c2[j], c2[j] = 0;
        }

        vector<int> ans;
        for (int i = 0; i <= sum; i++){
            if(!c1[i]){
                ans.push_back(i);
            }
        }
        printf("%lu\n", ans.size());
        for (int i = 0; i < ans.size(); i++)
            printf("%d%c", ans[i], i == ans.size() - 1 ? '\n' : ' ');
    }
        return 0;
}

```

<hr>

### HDUOJ2152_Fruit

#### 🔗
http://acm.hdu.edu.cn/showproblem.php?pid=2152

#### 💡


#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >  
  

```cpp
#include <algorithm>
#include <iostream>
#include <cstring>
#include <string>
#include <vector>
#include <cstdio>
#include <stack>
#include <queue>
#include <cmath>
#include <map>
#include <set>
#define G 10.0
#define LNF 1e18
#define eps 1e-6
#define ll long long
#define INF 0x7FFFFFFF
#define Chivas int main()
#define Regal return 0
#define PI acos(-1.0)
#define pb(x) push_back(x)
#define SP system("pause")
#define mm(a, b) memset(a, b, sizeof(a))
#define fir(i, a, n) for (ll i = a; i <= n; i++)
#define rif(i, a, n) for (ll i = a; i >= n; i--)
#define each_cass(cass) for (scanf("%d", &cass); cass; cass--)

using namespace std;

const ll maxn = 1e4 + 10;
ll n, m;
struct fruit{
    ll a;
    ll b;
    void read(){
        scanf("%lld%lld", &a, &b);
    }
} f[110];
ll c1[maxn];
ll c2[maxn];

void init(){
    mm(c1, 0);
    mm(c2, 0);
    for (ll i = f[1].a; i <= f[1].b; i++)
        c1[i] = 1;
}

Chivas{
    while (scanf("%lld%lld", &n, &m) == 2){
        for (ll i = 1; i <= n; i++)
            f[i].read();
        init();
        for (ll i = 2; i <= n; i++){
            for (ll j = 0; j <= m; j++){
                for (ll k = f[i].a; k + j <= m && k <= f[i].b; k++)
                    c2[j + k] += c1[j];
            }
            for (ll j = 0; j <= m; j++)
                c1[j] = c2[j], c2[j] = 0;
        }
        printf("%lld\n", c1[m]);
    }
    Regal;
}

```

<hr>

## 容斥原理

### 洛谷P1450_硬币购物

#### 🔗
<a href="https://www.luogu.com.cn/problem/P1450"><img src="https://i.loli.net/2021/11/10/27LQvBmkElueGT6.png"></a>

#### 💡
本题尝试生成函数  <img src="https://latex.codecogs.com/svg.image?\inline&space;10" title="\inline 10" /> 分，  <img src="https://latex.codecogs.com/svg.image?\inline&space;FFT" title="\inline FFT" /> 优化还是  <img src="https://latex.codecogs.com/svg.image?\inline&space;10" title="\inline 10" /> 分...  
  
看了眼时间，开始老老实实想背包   
（不会吧  <img src="https://latex.codecogs.com/svg.image?\inline&space;O(n)" title="\inline O(n)" /> 是极限而且不一定过？  
  
提前给定的  <img src="https://latex.codecogs.com/svg.image?\inline&space;c[0...4]" title="\inline c[0...4]" /> 一定有其用意，先拿完全背包预处理一下  <img src="https://latex.codecogs.com/svg.image?\inline&space;dp" title="\inline dp" />  数组  
但是让多重背包，我们就容斥减掉不合法的  
假设我们枚举第  <img src="https://latex.codecogs.com/svg.image?\inline&space;i" title="\inline i" /> 个，此时我们如果预先拿走  <img src="https://latex.codecogs.com/svg.image?\inline&space;d[i]+1" title="\inline d[i]+1" /> 个，那么之后的任意选择方式都是不合法的  
此时不合法的也就是容积  <img src="https://latex.codecogs.com/svg.image?\inline&space;n-c[i]\times&space;(d[i]+1)" title="\inline n-c[i]\times&space;(d[i]+1)" /> 的背包，我们减去  <img src="https://latex.codecogs.com/svg.image?\inline&space;dp[n-c[i]*(d[i]+1)]" title="\inline dp[n-c[i]*(d[i]+1)]" />   
当然因为是容斥，所以我们还要加回来提前两个不合法，减掉提前三个不合法...   
  
二进制枚举，观察时间复杂的，  <img src="https://latex.codecogs.com/svg.image?\inline&space;T*2^4" title="\inline T*2^4" /> 很正常的时间    
  
好家伙，容斥改完全背包为多重背包...

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
#include <iostream>

#define ll long long

using namespace std;

const int N = 1e5 + 10;
int c[N], d[N], n;
ll dp[N];

inline void Solve () {
        for ( int i = 0; i < 4; i ++ ) cin >> d[i];
        cin >> n;
        ll res = dp[n];
        for ( int i = 0; i < (1 << 4); i ++ ) { // 枚举提前选哪些物品超过限制
                int cnt = 0; ll cur = 0;
                for ( int j = 0; j < 4; j ++ ) {
                        if ( i & (1 << j) ) {
                                cnt ++;
                                cur += (ll)c[j] * (d[j] + 1);
                        }
                }
                if ( cur > n || cur == 0 ) continue; // n以下没有不合法解 或者 全都不选不构成解也不构成不合法解
                if ( cnt & 1 ) res -= dp[n - cur];
                else           res += dp[n - cur];
        }
        cout << res << endl;
}

int main () {
        for ( int i = 0; i < 4; i ++ ) cin >> c[i]; 
        dp[0] = 1; for ( int i = 0; i < 4; i ++ ) for ( int j = c[i]; j < N; j ++ ) dp[j] += dp[j - c[i]]; 

        int cass; cin >> cass; while ( cass -- ) {
                Solve ();
        }
}
```

<hr>

### 牛客2022寒假算法基础集训营K_智乃的C语言模除方程

#### 🔗
<a href="https://ac.nowcoder.com/acm/contest/23478/K"><img src="https://img-blog.csdnimg.cn/6d2ed77c2fe84b679c807b3bf69a7975.png"></a>

#### 💡
本题是让我们计数  
让 $[l,r]$ 以 $p$ 为循环区间进行移动，看多少个模后存在于 $[L,R]$ 中  
首先肯定是要看需不需要从 $0$ 的位置分开计算的  

对于 $[L,R]$ 都在同一边的，我们可以想到用容斥， $calc(R)-calc(L-1)$ 这种  
那么不在一边的我们要分开计算然后加起来  

那么就将区间问题转化为前缀的点问题了  
任务是求从 $x$ 到 $0$ 有多少个数模后为 $[l,r]$ ，上面在叙述问题时已经很明白了，这个计算循环节进行优化  
以 $[0,p-1]$ 为循环节，每个循环节内计算 $[0,p-1]\cap[l,r]$ 的个数，然后循环 $\left\lfloor\frac xp\right\rfloor$ 次  
多出来的就算一下 $[0,x\%p]\cap[l,r]$ 即可  
  
相交区间长度我们写一个函数 `get_intersection(a, b, c, d)` 来计算   
那么我们对于循环 `x / p` 次，每个循环有 `get_intersection(0, p - 1, l, r)` 个相交，加上 `get_intersection(0, x % p, l, r)` 这样去算  
记得对 `x` 分奇偶

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
ll P, l, r, L, R;

inline ll get_Intersection ( ll a, ll b, ll c, ll d ) {
        if ( c > b || d < a ) return 0;
        return min(b, d) - max(a, c) + 1;
}
inline ll Query ( ll bondry ) {
        if ( bondry < 0 ) 
                return (- bondry / P) * get_Intersection(- P + 1, 0, l, r) + get_Intersection(bondry % P, 0, l, r );
        else 
                return bondry / P * get_Intersection(0, P - 1, l, r) + get_Intersection(0, bondry % P, l, r);
}

int main () {
        ios::sync_with_stdio(false);

        cin >> P >> l >> r >> L >> R;
        P = llabs(P);
        if ( L <= 0 && R >= 0 ) 
                cout << Query(R) + Query(L) - Query(0) << endl; // 分开计算，多算了个 0
        else if ( L < 0 && R < 0 )
                cout << Query(L) - Query(R + 1) << endl; // 负数容斥
        else 
                cout << Query(R) - Query(L - 1) << endl; // 正数容斥
}
```
<hr>


### 牛客练习赛92C_D与C

#### 🔗
<a href="https://ac.nowcoder.com/acm/contest/11182/C"><img src="https://i.loli.net/2021/11/27/Ne98jLhYZSQsnxz.png"></a>

#### 💡
真就看见计数想容斥呗  
首先可以得到总边数  <img src="https://latex.codecogs.com/svg.image?\inline&space;has\_edge" title="\inline has\_edge" />  为  <img src="https://latex.codecogs.com/svg.image?\inline&space;\frac{n\times&space;(n-1)}2" title="\inline \frac{n\times&space;(n-1)}2" />  
对于这些边数让两人一起放一共有  <img src="https://latex.codecogs.com/svg.image?\inline&space;\binom{has\_edge}{a}\times\binom{has\_edge}{b}" title="\inline \binom{}{}" /> 种情况，设为  <img src="https://latex.codecogs.com/svg.image?\inline&space;has\_situation" title="\inline has\_situation" />   

如果  <img src="https://latex.codecogs.com/svg.image?\inline&space;a+b\ge&space;has\_edge" title="\inline a+b\ge&space;has\_edge" /> 那么不管咋放都成立，直接输出  <img src="https://latex.codecogs.com/svg.image?\inline&space;has\_situation" title="\inline has\_situation" /> 就行  
否则看看两人没有公共边的情况  
就是在  <img src="https://latex.codecogs.com/svg.image?\inline&space;has\_edge" title="\inline has\_edge" /> 中选  <img src="https://latex.codecogs.com/svg.image?\inline&space;a" title="\inline a" /> 个，再从  <img src="https://latex.codecogs.com/svg.image?\inline&space;has\_edge-a" title="\inline has\_edge-a" /> 个中选  <img src="https://latex.codecogs.com/svg.image?\inline&space;b" title="\inline b" /> 个  
这样的答案就是  <img src="https://latex.codecogs.com/svg.image?\inline&space;has\_situation-\binom{has\_edge}{a}\times\binom{has\_edge-a}{b}" title="\inline has\_situation-\binom{has\_edge}{a}\times\binom{has\_edge-a}{b}" />   

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
#include <iostream>

#define ll long long

using namespace std;

const int mod = 1e9 + 7;
const int N = 1e6 + 10;

ll f[N];
inline void Get () {
        f[0] = 1;
        for ( ll i = 1; i < N; i ++ ) f[i] = f[i - 1] * i % mod;
}
inline ll ksm ( ll a, ll b ) {
        ll res = 1;
        while ( b ) {
                if ( b & 1 ) res = res * a % mod;
                a = a * a % mod;
                b >>= 1;
        }
        return res;
}
inline ll inv ( ll x ) { return ksm (x, mod - 2); }
inline ll C ( ll n, ll m ) {
        return f[n] * inv(f[m]) % mod * inv(f[n - m]) % mod;
}

int main () {
        Get();
        ll n, a, b; cin >> n >> a >> b;
        ll has_edge = n * (n - 1) / 2;
        ll has_situation = C(has_edge, a) * C(has_edge, b) % mod;
        if ( a + b >= has_edge ) cout << has_situation << endl;
        else {
                ll sub = C(has_edge, a) * C(has_edge - a, b) % mod;
                cout << (has_edge - sub + mod) % mod << endl;
        }
}
```

<hr>

### ABC221E_LEQ

#### 🔗
<a href="https://atcoder.jp/contests/abc221/tasks/abc221_e?lang=en"><img src="https://i.loli.net/2021/10/03/zgE36rAUpOTkXHQ.png"></a>

#### 💡
问题转化一下就是  
从左向右，<img src="https://latex.codecogs.com/svg.image?a[i]" title="a[i]" />的贡献就是每个前面比它小的<img src="https://latex.codecogs.com/svg.image?a[j]" title="a[j]" />，在这个位置上的贡献为<img src="https://latex.codecogs.com/svg.image?2^{i-j-1}" title="2^{i-j-1}" />  
由于区间长度总是参差不齐的  
那么对于每个<img src="https://latex.codecogs.com/svg.image?a[j]" title="a[j]" />，我们都可以维护一个前缀贡献为<img src="https://latex.codecogs.com/svg.image?2^{-j-1}&space;" title="2^{-j-1} " />   
然后在<img src="https://latex.codecogs.com/svg.image?i" title="i" />的位置的时候的贡献容斥为<img src="https://latex.codecogs.com/svg.image?\sum\frac{2^i}{2^{j&plus;1}}" title="\sum\frac{2^i}{2^{j+1}}" />即可，其中sum可以由树状数组的前缀得到  
所以每次累加查询<img src="https://latex.codecogs.com/svg.image?a[i]" title="a[i]" />位置以前的总贡献，`query(a[i]) * ksm(2, i)`  
然后在<img src="https://latex.codecogs.com/svg.image?a[i]" title="a[i]" />的位置上更新一下这个前缀贡献，`update( a[i], ksm(ksm(2, i + 1), mod - 2) )`  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#define ll long long
using namespace std;

const int N = 3e5 + 10;
const int mod = 998244353;
ll n, a[N];
vector<ll> nums;

inline ll ksm ( ll a, ll b ) {
	ll res = 1;
	while ( b ) {
		if ( b & 1 ) res = res * a % mod;
		a = a * a % mod;
		b >>= 1;
	}
	return res;
}

namespace TreeArray {
	ll tr[N];
	inline ll lowbit ( ll x ) {
		return x & -x;
	}
	inline void update ( ll id, ll val ) {
		while ( id < N ) tr[id] = (tr[id] + val) % mod, id += lowbit(id);
	}
	inline ll query ( ll id ) {
		ll res = 0;
		while ( id > 0 ) res = (res + tr[id]) % mod, id -= lowbit(id);
		return res;
	}
} using namespace TreeArray;

int main() {
#ifndef ONLINE_JUDGE
	freopen("in.in", "r", stdin);
	freopen("out.out", "w", stdout);
#endif
	cin >> n;
	ll res = 0;
	for ( int i = 1; i <= n; i ++ ) 
		cin >> a[i],
		nums.push_back(a[i]);
	sort ( nums.begin(), nums.end() );
	nums.erase(unique(nums.begin(), nums.end()), nums.end());
	for ( int i = 1; i <= n; i ++ ) a[i] = lower_bound(nums.begin(), nums.end(), a[i]) - nums.begin() + 1;
	for ( int i = 1; i <= n; i ++ ) {
		res = (res + query(a[i]) * ksm(2, i) % mod) % mod;
		update (a[i], ksm(ksm(2, i + 1), mod - 2));	
	}
	cout << res << endl;
	return 0;
}
```

<hr>

### CodeForces451E_DevuAndFlowers

#### 🔗
<a href="https://www.luogu.com.cn/problem/CF451E"><img src="https://i.loli.net/2021/11/24/l2YRfXkU7Aq5bGQ.png"></a>

#### 💡
这个数据量...  
感觉母函数过不了，看了眼  <img src="https://latex.codecogs.com/svg.image?\inline&space;n" title="\inline n" />  想一下容斥  
  
和多重背包超限一样  
我们考虑这里面的总方案和不合法方案  
如果箱子无限朵花，那么就是  <img src="https://latex.codecogs.com/svg.image?\inline&space;\binom{s+n-1}{n-1}" title="\inline \binom{s+n-1}{n-1}" />  种取法  
>即问：  <img src="https://latex.codecogs.com/svg.image?\inline&space;\sum\limits_{i=1}^nx_i=s" title="\inline \sum\limits_{i=1}^nx_i=s" />   
>那就是使用  <img src="https://latex.codecogs.com/svg.image?\inline&space;n-1" title="\line n-1" />  个隔板将  <img src="https://latex.codecogs.com/svg.image?\inline&space;s" title="\inline s" />  个物品分割成  <img src="https://latex.codecogs.com/svg.image?\inline&space;n" title="\inline n" />  份  
>那就是有了  <img src="https://latex.codecogs.com/svg.image?\inline&space;s+n-1" title="\inline s+n-1" />  个位置可以用来放这  <img src="https://latex.codecogs.com/svg.image?\inline&space;n-1" title="\inline n-1" />  个隔板  
>方案数就是  <img src="https://latex.codecogs.com/svg.image?\inline&space;\binom{s+n-1}{n-1}" title="\inline \binom{s+n-1}{n-1}" /> 

不合法方案就是“你第  <img src="https://latex.codecogs.com/svg.image?\inline&space;i" title="\inline i" />  个箱子只有  <img src="https://latex.codecogs.com/svg.image?\inline&space;x_i" title="\inline x_i" />  朵花，但是你取了  <img src="https://latex.codecogs.com/svg.image?\inline&space;x_i+1" title="\inline x_i+1" />  朵花  
  
那么我们如果直接强制在<img src="https://latex.codecogs.com/svg.image?\inline&space;i" title="\inline i" />号箱子取  <img src="https://latex.codecogs.com/svg.image?\inline&space;x_i+1" title="\inline x_i+1" />  朵花，那么别的所有取法都不合法  
这就是容斥的问题了，因为枚举会出现重复  
所以就（奇数个箱子）-（偶数个箱子）  
  
由于一开始给出的 <img src="https://latex.codecogs.com/svg.image?\inline&space;s" title="\line s" /> 可能很大，所以这里需要用 <img src="https://latex.codecogs.com/svg.image?\inline&space;Lucas" title="\line Lucas" /> 定理


#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
const int N = 30;
const int mod = 1e9 + 7;

namespace PermutationAndCombination {
        inline ll ksm ( ll a, ll b ) {
                ll res = 1;
                while ( b ) {
                        if ( b & 1 ) res = res * a % mod;
                        a = a * a % mod;
                        b >>= 1;
                }
                return res;
        }
        inline ll inv ( ll x ) { return ksm(x, mod - 2); }

        ll iv[N];
        inline void Get () {
                for ( int i = 1; i < N; i ++ ) iv[i] = inv(i);
        }
        inline ll C ( ll n, ll m ) {
                if ( n < m )   return 0;
                if ( n < mod ) {
                        ll res = 1;
                        for ( ll i = 1; i <= m; i ++ ) {
                                ll a = (n + i - m) % mod;
                                ll b = i % mod;
                                res = res * a % mod * iv[b] % mod;
                        }
                        return res;
                }
                return C ( n / mod, m / mod ) * C ( n % mod, m % mod ) % mod;
        }
} using namespace PermutationAndCombination;

ll a[N], n, s, res;
int main () {
        ios::sync_with_stdio(false);
        Get(); cin >> n >> s;
        for ( int i = 0; i < n; i ++ ) cin >> a[i];
        for ( int i = 0; i < (1 << n); i ++ ) {
                ll np = 1, cur = s;
                for ( int j = 0; j < n; j ++ ) {
                        if ( i & (1 << j) ) {
                                np = -np;
                                cur -= a[j] + 1; 
                        }
                }
                if ( cur < 0 ) continue;
                ll upd = C(cur + n - 1, n - 1);
                res = (res + np * upd) % mod;
        }
        cout << (res + mod) % mod << endl;
}
```

<hr>

### CodeForces979C_KuroAndWalkingRoute

#### 🔗
<a href="https://codeforces.com/problemset/problem/979/C"><img src="https://i.loli.net/2021/09/30/BFybalLjWnoRu4X.png"></a>

#### 💡
直接处理可以到达的点对很麻烦，要考虑很多种情况  
那么可以容斥地减一下不能到达的点  
即通过y再到达x即之后的点  
  
既然是一棵树  
那么就直接用"x的子树大小"乘"y的子树中不包含x的子树的大小总和"就是我们要减的值  
即`res = n * (n - 1) - son[x] * elsSon`  
  
可以再写一个判断判断子树中有没有x的函数  
处理好son[]后，对y的子节点一个个判断并乘一下就行了  


#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
const ll N = 3e5 + 10, M = N * 2;
ll n, X, Y;
ll res;
struct Edge { ll nxt, to; } edge [M]; ll head[M], cnt;

inline void add_Edge ( ll from, ll to ) {
        edge[ ++ cnt ] = { head[from], to };
        head[from] = cnt;
}
ll son[N], sonels;
inline void get_Sz ( ll x, ll fath ) {
        for ( ll i = head[x]; ~i; i = edge[i].nxt ) {
                ll to = edge[i].to;
                if ( to == fath ) continue;
                get_Sz ( to, x );
                son[x] += son[to];
        }
}
inline bool check ( ll x, ll fath ) {
        ll res = 1;
        if ( x == X ) res = 0;
        for ( ll i = head[x]; ~i; i = edge[i].nxt ) {
                ll to = edge[i].to;
                if ( to == fath ) continue;
                res *= check(to, x);
        }
        return res;
}

int main () {
#ifndef ONLINE_JUDGE
        freopen("in.in", "r", stdin);
        freopen("out.out", "w", stdout);
#endif 
        memset ( head, -1, sizeof head );
        for ( ll i = 0; i < N; i ++ ) son[i] = 1;
        scanf("%lld%lld%lld", &n, &X, &Y);
        res = n * (n - 1);
        for ( ll i = 1; i < n; i ++ ) {
                ll a, b; cin >> a >> b;
                add_Edge ( a, b );
                add_Edge ( b, a );
        }
        get_Sz ( Y, -1 );
        for ( ll i = head[Y]; ~i; i = edge[i].nxt ) {
                sonels += check(edge[i].to, Y) * son[edge[i].to];
        }
        sonels ++;
        res -= son[X] * sonels;
        printf("%lld\n", res);
}
```

<hr>

### CodeForces1569C_JuryMeeting

#### 🔗
<a href="https://codeforces.com/contest/1569/problem/C"><img src="https://i.loli.net/2021/09/09/feoEr5vRHgldT9p.png"></a>

#### 💡
观察题目转换一下题目问题  
即最大值的后面至少有一个可以让最大值最后一步和倒数第二步不在一起的数  
那么如果最大值有两个，怎么搞都可以  
如果最大值和次大值的差值大于1则怎么搞都不行  
然后就是最大值和次大值差值为1的情况  
  
获取一下所有的排列方式即<img src="https://latex.codecogs.com/svg.image?n!" title="n!" />  
然后最大值在最后是不可以的，所以要减去<img src="https://latex.codecogs.com/svg.image?(n-1)!" title="(n-1)!" />  
然后计算所有次大值都在最大值前面的情况  
  
我们设置<img src="https://latex.codecogs.com/svg.image?a_0" title="a_0" />是最大值，<img src="https://latex.codecogs.com/svg.image?a_1" title="a_1" />是次大值，<img src="https://latex.codecogs.com/svg.image?num_i" title="num_i" />是<img src="https://latex.codecogs.com/svg.image?i" title="i" />出现的个数  
最大值前面至少要留下<img src="https://latex.codecogs.com/svg.image?num_{a_1" title="num_{a_1" />，最多就是<img src="https://latex.codecogs.com/svg.image?n-2" title="n-2" />个  
那么我们以<img src="https://latex.codecogs.com/svg.image?i" title="i" />遍历  
将<img src="https://latex.codecogs.com/svg.image?num_{a_1" title="num_{a_1" />个数不记顺序地放入<img src="https://latex.codecogs.com/svg.image?i" title="i" />个空中  
即<img src="https://latex.codecogs.com/svg.image?C_i^{num_{a_1}}" title="C_i^{num_{a_1}}" />  
然后对这<img src="https://latex.codecogs.com/svg.image?num_{a_1" title="num_{a_1" />个数考虑顺序，对其余的<img src="https://latex.codecogs.com/svg.image?n-num_{a_1}-1" title="n-num_{a_1}-1" />个数考虑顺序  
即都是阶乘  
那么就有公式：  
<img src="https://latex.codecogs.com/svg.image?n!-(n-1)!-\sum\limits_{i=num_{a_1}}^{n-2}\{C_i^{num_{a_1}}\times&space;num_{a_1}!\times&space;(n-1-num_{a_1})!\}" title="n!-(n-1)!-\sum\limits_{i=num_{a_1}}^{n-2}\{C_i^{num_{a_1}}\times num_{a_1}!\times (n-1-num_{a_1})!\}" />  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
#include <iostream>
#include <algorithm>
#include <map>
#include <cmath>
#include <vector>
#include <cstring>
#include <list>
using namespace std;
#define ll long long
const int N = 200005;
const ll mod = 998244353;

ll a[N];
ll f[N];
ll n;
map<ll, ll> num;
inline void get_F () {
        f[0] = 1;
        for ( int i = 1; i < N; i ++ ) {
                f[i] = f[i - 1] * i % mod;
        }
}
inline ll ksm ( ll a, ll b ) {
        ll res = 1;
        while ( b ) {
                if ( b & 1 ) res = res * a % mod;
                a = a * a % mod;
                b >>= 1;
        }
        return res;
}
inline ll C ( ll a, ll b ) { 
        return f[a] * ksm(f[b], mod - 2) % mod * ksm(f[a - b], mod - 2) % mod;
}
inline void solve () {
        num.clear();
        cin >> n;
        for ( int i = 0; i < n; i ++ ) 
                cin >> a[i],
                num[a[i]] ++;
        sort ( a, a + n, [] ( ll a, ll b ) { return a > b; } );
        
        if ( a[0] - a[1] > 1 ) { // 最后一个要自己一个连续减好多次
                cout << 0 << endl;
        } else if ( num[a[0]] > 1 ) { // 自己和自己顶，可以随便搞
                cout << f[n] << endl;
        } else {
                ll res = f[n]; // 初始化为所有的情况
                ll del = f[n - 1]; // 要删去的不符合的情况
                for ( int i = num[a[1]]; i <= n - 2; i ++ ) {
                        del = ( del + C(i, num[a[1]]) * f[num[a[1]]] % mod * f[n - 1 - num[a[1]]] % mod ) % mod;
                }
                cout << ( ( res - del ) % mod + mod) % mod << endl;
        }
}

int main () {
#ifndef ONLINE_JUDGE
        freopen("in.in", "r", stdin);
        freopen("out.out", "w", stdout);
#endif
        get_F();
        ll cass; cin >> cass; while ( cass -- ) {
                solve();
        }
}
```

<hr>

### HDU2021多校(10)4_PtyHatesPrimeNumbers

#### 🔗
<a href="https://acm.dingbacode.com/showproblem.php?pid=7080"><img src="https://i.loli.net/2021/10/20/eH9yNx3BRCOqoMV.png"></a>

#### 💡
问题可以转化一下，由于自己也是自己的因数，所以就是问[1, n]内有多少个数不是前k个素数的倍数  
这类计数问题很快联想到容斥  
  
16个数，但是有1e5组数据  
那么2^16 * 1e5就很难办了  
但是2^8还是很好过的，那么可以对质数的组合乘积情况打表vec  
对于前k个质数，k<=8，我们打1~8的容斥表  
对于k>8，我们打9~16的容斥表  
(由于容斥表中含1，即都不选，那么我们不需要使用n-vec[i]来计算不是前k素数倍数的个数）   
  
**k<=8**  
我们直接就容斥地`res +-= n / vec[i]`就行了  
**k>8**  
我们还要做一些处理  
前八个素数的乘积是9699690  
有个显然的性质就是：如果一个数x不是前八个素数的倍数，x%9699690也不会是前八个素数的倍数（同余  
而9699690也不是非常大，所以我们可以继续预处理一下9699690以内不是前八个数的倍数的个数（前缀地处理  
然后我们可以利用我们处理出来的信息，容斥x=“在n以内不是vec[i]的倍数的数中，也不是前8个数的倍数的情况”  
  
这里我们可以采用枚举倍数的方式  
n / vec[i]表示的是n以内从1开始的vec[i]的倍数  
对这些倍数，[1, ..]相当于拆解完vec[i]这个质因数之后残余的数，且从1开始连续  
这些数中我们可以求一下N的周期个数，每个周期有sum[N]个满足条件的数    
然后剩余n / vec[i] % N，这里面有sum[n / vec[i] % N]个满足条件的数  
  
容斥这些数就行了  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
const int N = 9699690;
int prime[] = {0, 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53}; // 前16个质数
vector<ll> a[20], b[20]; // 01枚举后，奇数个数的乘积情况和偶数哥的乘积情况
int sum[N + 10]; // sum[i] = [1, i]中不能被前八个质数整除的个数

inline void DFS ( int id, ll res, int cnt, int k ) { // 构造容斥数组（塞入1，不用取反数了
        if ( id > k ) {
                if ( cnt & 1 ) a[k].emplace_back(res);
                else           b[k].emplace_back(res);
                return; 
        }
        DFS ( id + 1, res * prime[id], cnt + 1, k );
        DFS ( id + 1, res,             cnt,     k );
}
inline void Pre () { // 预处理sum与容斥数组
        for ( int k = 1; k <= 16; k ++ ) {
                if ( k <= 8 ) DFS ( 1, 1, 0, k );
                else          DFS ( 9, 1, 0, k );
        }
        for ( int i = 1; i <= 8; i ++ ) for ( int j = prime[i]; j <= N; j += prime[i] ) sum[j] = 1; // 埃氏筛
        for ( int i = 1; i <= N; i ++ ) sum[i] = sum[i - 1] + (sum[i] == 0);
}
int main () {
        ios::sync_with_stdio(false); Pre();
        int cass; cin >> cass; while ( cass -- ) {
                ll n, k, res = 0;
                cin >> n >> k;
                if ( k <= 8 ) {
                        for ( auto i : a[k] ) res -= n / i; // 普通的容斥原理
                        for ( auto i : b[k] ) res += n / i;
                } else {
                        for ( auto i : a[k] ) res -= n / i / N * sum[N] + sum[n / i % N]; // 相当于枚举倍数，倍数有 n / i 个，在[1, n / i]中找N的周期与模N之后剩余的个数
                        for ( auto i : b[k] ) res += n / i / N * sum[N] + sum[n / i % N];
                }
                cout << res << endl;
        }
}
```

<hr>

### HDUOJ5776_sum

#### 🔗
http://acm.hdu.edu.cn/showproblem.php?pid=5776

#### 💡


#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >  
  

```cpp
#pragma region
#pragma GCC optimize(3,"Ofast","inline")
#include <algorithm>
#include <iostream>
#include <cstring>
#include <string>
#include <vector>
#include <cstdio>
#include <stack>
#include <queue>
#include <cmath>
#include <map>
#include <set>
#define G 10.0
#define LNF 1e18
#define eps 1e-6
#define PI acos(-1.0)
#define ll long long
#define INF 0x7FFFFFFF
#define Regal exit(0)
#define Chivas int main()
#define pb(x) push_back(x)
#define SP system("pause")
#define Max(a,b) ((a)>(b)?(a):(b))
#define Min(a,b) ((a)<(b)?(a):(b))
#define IOS ios::sync_with_stdio(false)
#define mm(a, b) memset(a, b, sizeof(a))
#define each(cass) for (cin>>cass; cass; cass--)
#define test(a) cout << "---------" << a << "---------" << '\n'
 
using namespace std;
#pragma endregion

//全局变量
#pragma region
string fro[100005];
string enn[100005];
int n, m;
vector<int> a;
map<int, int> vis;
int sum;
int cass;
#pragma endregion

inline void solve(){
    a.clear();
    vis.clear();
    sum = 0;
    cin >> n >> m;
    for(int i = 0, x; i < n; i ++){
        cin >> x;
        a.push_back(x);
    }
    for(int i = 0; i < n; i ++){
        sum = (sum + a[i]) % m;
        if(sum == 0){
            cout << "YES" << endl;
            return;
        }
        if(vis[sum]){
            cout << "YES" << endl;
            return;
        }
        vis[sum] = 1;
    }
    cout << "NO" << endl;
}

Chivas{
    each(cass){
        solve();
    }
    Regal;
}
```

<hr>

### HRBUST2414_格子染色计数

#### 🔗
http://acm.hrbust.edu.cn/index.php?m=ProblemSet&a=showProblem&problem_id=2414

#### 💡
设第a[i]种颜色不能用  
那么我们在选k个数中，要求得的是  
<img src="https://latex.codecogs.com/svg.image?1-P(a[1]\cup&space;a[2]\cup&space;a[3]\cup&space;...\cup&space;a[k]&space;)" title="1-P(a[1]\cup a[2]\cup a[3]\cup ...\cup a[k] )" />  
转化成容斥原理图得到的也就是  
<img src="https://latex.codecogs.com/svg.image?\begin{align}&space;&space;1&-(P(a[1])&plus;P(a[2])&plus;...&plus;P(a[k]))\\&space;&&plus;&space;(P(a[1]\cap&space;a[2])&plus;P(a[1]\cap&space;a[3])&plus;...&plus;P(a[k-1]\cap&space;a[k]))&space;\\&-(P(a[1]\cap&space;a[2]\cap&space;a[3])&plus;P(a[1]\cap&space;a[2]\cap&space;a[4])&plus;...&plus;P(a[k-2]\cap&space;a[k-1]\cap&space;a[k]))\\&...\end{align}" title="\begin{align} 1&-(P(a[1])+P(a[2])+...+P(a[k]))\\ &+ (P(a[1]\cap a[2])+P(a[1]\cap a[3])+...+P(a[k-1]\cap a[k])) \\&-(P(a[1]\cap a[2]\cap a[3])+P(a[1]\cap a[2]\cap a[4])+...+P(a[k-2]\cap a[k-1]\cap a[k]))\\&...\end{align}" />    
转化成公式就是  
<img src="https://latex.codecogs.com/svg.image?C_m^k(\sum_{i=1}^{k}(-1)^{k-i}C_k^ii(i-1)^{n-1})" title="C_m^k(\sum_{i=1}^{k}(-1)^{k-i}C_k^ii(i-1)^{n-1})" />  
那么就开卢卡斯定理求解即可  


#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
#include <iostream>
#define ll long long
using namespace std;

const int mod = 1e9 + 7;

ll inv[1000010]; // 预处理很重要

inline ll ksm ( ll a, ll b, ll p ) {
        ll res = 1;
        while ( b ) {
                if ( b & 1 ) res = res * a % p;
                a = a * a % p;
                b >>= 1;
        }
        return res;
}

inline void Init () {
        for ( ll i = 1; i < 1000010; i ++ ) inv[i] = ksm(i, mod - 2, mod);
}

inline ll C ( ll n, ll m, ll p ) {
        if ( m > n ) return 0;
        ll res = 1;
        for ( ll i = 1; i <= m; i ++ ) {
                ll a = (n + i - m) % p;
                ll b = i % p;
                res = res * (a * ksm(b, mod - 2, mod) % p) % p;
        }
        return res;
}

inline ll lucas ( ll n, ll m, ll p ) {
        if ( m == 0 ) return 1;
        return C( n % p, m % p, p ) * lucas ( n / p, m / p, p ) % p;
}

int main () {
        Init();
        int cass;
        for ( scanf("%d", &cass); cass; cass -- ) {
                ll n, m, k; scanf("%lld%lld%lld", &n, &m, &k);
                ll tmp = 1;
                ll res =  0;
                for ( int i = 1; i <= k; i ++ ) {
                        int flag = (k - i) % 2 == 0 ? 1 : -1; // 这一位该加该减
                        tmp = ((tmp * (k - i + 1)) % mod * inv[i]) % mod; // 不用每遍都lucas，推着用着即可
                        res = (res + flag * (i * ksm(i - 1, n - 1, mod) % mod) * tmp % mod + mod) % mod;
                }
                printf("%lld\n", res * lucas(m, k, mod) % mod);
        }
        return 0;
}
```

<hr>


## 鸽笼原理

### CodeForces577B_ModuloSum

#### 🔗
<a href="https://codeforces.com/contest/577/problem/B">![20220303092428](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20220303092428.png)</a>

#### 💡
首先根据鸽笼原理  
若 $m<=n$  
对于前 $m$ 个数有 $m$ 个前缀和  
- 存在 $0$ ，显然可以
- 不存在 $0$，$m$ 个数用 $sz\{1,2,\dots,m-1\}=m-1$ 个余数，必然有两重复，重复的前缀和构成的区间和为 $0$ ，也可以  

若 $m>n$  
那么 $n<m\le 1000$ ，则暴力跑一遍 $01$ 背包即可  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
int n, m;
bool dp[2][1000];

int main () {
	ios::sync_with_stdio(false);
	cin >> n >> m;
	if ( m <= n ) {
		cout << "YES" << endl;
		return 0;
	}
	for ( int i = 1; i <= n; i ++ ) {
		int x; cin >> x; x %= m;
		memset(dp[i & 1], false, sizeof dp[i & 1]);
		dp[i & 1][x] = true;
		for ( int j = 0; j < m; j ++ ) {
			dp[i & 1][j]           |= dp[i - 1 & 1][j];
			dp[i & 1][(j + x) % m] |= dp[i - 1 & 1][j];
		} 
		if ( dp[i & 1][0] ) { cout << "YES"; return 0; }
	}
	cout << "NO";
}
```
<hr>


### NamomoCamp2022春季每日一题4_选数

#### 🔗
<a href="http://oj.daimayuan.top/problem/456">![20220302115716](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20220302115716.png)</a>

#### 💡
$n$ 个数，范围很明显了，这里最多有 $n$ 个不同的模数  
考虑前缀和，一共有 $n$ 个前缀和，如果出现 $0$ 那么就直接输出这个前缀即可  
有可能没有 $0$ ，那么 $n$ 个前缀和要用 $n-1$ 个数就必然存在两个前缀和相同  
相同的两个前缀和减出来的区间和为 $0$ ，也能满足  
  
所以每次算前缀和，如果为 $0$ 直接输出，否则查看是否之前存在过这个前缀和，如果存在过，就从上一个该前缀和下标 $+1$ 一直到当前位置  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
const int N = 1e5 + 10;
int n, a[N];
int id[N], sum;

int main () {
	ios::sync_with_stdio(false);
    
	cin >> n;
	for ( int i = 1; i <= n; i ++ ) {
		cin >> a[i];
		sum = (sum + a[i]) % n;
		if ( sum == 0 ) {
			cout << i << endl;
			for ( int j = 1; j <= i; j ++ ) cout << j << " ";
			cout << endl;
			return 0;
		}
		if ( id[sum] ) {
			cout << i - id[sum] << endl;
			for ( int j = id[sum] + 1; j <= i; j ++ ) cout << j << " ";
			return 0;
		}
		id[sum] = i;
	}
}
```
<hr>
