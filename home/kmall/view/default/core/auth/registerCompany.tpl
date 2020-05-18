{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body} 
  <div align="center">
<DIV class="block box">
<DIV id="ur_here">当前位置: <A href="http://localhost/ele/">首页</A> 
<CODE>&gt;</CODE> 用户中心  </DIV></DIV>
<DIV class="blank"></DIV>	
<DIV class="usBox">
<DIV class="usBox_2 clearfix">
<DIV class="regtitle"></DIV>
 <font color="{$color|default:'white'}">{$message|default:''}</font><br/>
<FORM method="post" name="formUser">
<TABLE border="0" cellSpacing="3" cellPadding="5" width="100%" align="left">
<TR>
    <TD width="19%" align="right">用户名</TD>
    <TD width="81%"><INPUT onBlur="is_registered(this.value);" id="username" 
      class="inputBg" name="username" size="25" type="text"><SPAN style="color: rgb(255, 0, 0);" 
      id="username_notice"> *</SPAN></TD></TR>
<TR>
    <TD align="right">密码</TD>
    <TD><INPUT onBlur="check_password(this.value);" style="width: 179px;" id="password1" 
      class="inputBg" onKeyUp="checkIntensity(this.value)" name="password" type="password"><SPAN 
      style="color: rgb(255, 0, 0);" id="password_notice"> *</SPAN></TD></TR>
<TR>
    <TD align="right">密码强度</TD>
    <TD>
      <TABLE border="0" cellSpacing="0" cellPadding="1" width="145">
        <TBODY>
        <TR align="center">
          <TD id="pwd_lower" width="33%">弱</TD>
          <TD id="pwd_middle" width="33%">中</TD>
          <TD id="pwd_high" width="33%">强</TD></TR></TBODY></TABLE></TD></TR>  
  <TR>
    <TD align="right">确认密码</TD>
    <TD><INPUT onBlur="check_conform_password(this.value);" style="width: 179px;" 
      id="conform_password" class="inputBg" name="confirm_password" type="password"><SPAN 
      style="color: rgb(255, 0, 0);" id="conform_password_notice"> 
*</SPAN></TD></TR>


  
  <TR>
    <TD id="extend_field4i" align="right">公司名称</TD>          
    <TD><INPUT class="inputBg" name="address" id="address" size="25" type="text">
    </TD>
  </TR>
  <TR>
    <TD id="extend_field5i" align="right">公司性质 </TD>         
    <TD><INPUT class="inputBg" name="mobilephone" id="mobilephone" size="25" 
      type="text"></TD></TR>
	   <TR>
    <TD id="extend_field5i" align="right">公司地址 </TD>         
    <TD><INPUT class="inputBg" name="email" id="email" size="25" 
      type="text"></TD></TR>
	   <TR>
    <TD id="extend_field5i" align="right">员工数量 </TD>        
    <TD><INPUT class="inputBg" name="birthday" id="birthday" size="25" 
      type="text"></TD></TR>
      <TD id="extend_field5i" align="right">职务 </TD>        
    <TD><select name="select">
    <option>专员</option>
    <option>经理</option>
    <option>总监</option>
    <option>工会主席</option>
    <option>办公室主任</option>
  </select></TD></TR>
       <TR>
    <TD id="extend_field5i" align="right">邮编  </TD>       
    <TD><INPUT class="inputBg" name="birthday" id="birthday" size="25" 
      type="text"></TD></TR>
  
   <TR>
    <TD id="extend_field5i" align="right">  </TD>       
    <TD>  
     <label>
    <input type="radio" name="radiobutton" value="radiobutton" />
	  HR部门联系人<input name="radiobutton" type="radio" value="radiobutton" checked="checked" />
	  </label>
	  <label>
	  	工会联系人
	  </label></TD></TR>
      
	    <TR>
    <TD id="extend_field5i" align="right">福利内容  </TD>       
    <TD>
     <label>
        <input type="checkbox" name="checkbox8" value="checkbox" />
		  春节福利
		  <input type="checkbox" name="checkbox" value="checkbox" />
		  中秋节福利
		  <input type="checkbox" name="checkbox2" value="checkbox" />
		  妇女节福利
		  <input type="checkbox" name="checkbox3" value="checkbox" />
		  端午节福利
		  <input type="checkbox" name="checkbox4" value="checkbox" />  
		  防暑降温
		  <input type="checkbox" name="checkbox5" value="checkbox" />
		  员工体检
		  <input type="checkbox" name="checkbox6" value="checkbox" />
		  员工生日
		  <input type="checkbox" name="checkbox7" value="checkbox" />
		  员工娱乐
		 
		  </label>
    </TD></TR>
      
	 
	
	
 
 
 
  <TR>
    <TD>&nbsp;</TD>
    <TD><LABEL><INPUT name="agreement" value="1" CHECKED="checked" type="checkbox">我已看过并接受《<A 
      style="color: blue;" href="http://localhost/shop/article.php?cat_id=-1" 
      target="_blank">用户协议</A>》</LABEL></TD></TR>
  <TR>
   <TD>&nbsp;</TD>
    <TD align="left"><input type="submit" name="Submit" value="提交" /></TD></TR>

  <TR>
    <TD>&nbsp;</TD>
    <TD class="actionSub"><A 
      href="http://localhost/shop/user.php?act=login">我已有账号，我要登录</A><BR><A href="http://localhost/shop/user.php?act=get_password">您忘记密码了吗？</A></TD></TR>                
</TABLE>
</FORM>
</DIV>
</DIV>
  </div>  

{/block}